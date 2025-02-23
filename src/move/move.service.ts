import { IMoveService } from '#move/interfaces/move.service.interface.js';
import { AreaType, IStorage, ProgressEnum, StatusEnum, UserType } from '#types/common.types.js';
import { MoveInfoGetQueries, moveInfoWithEstimationsGetQueries } from '#types/queries.type.js';
import { Injectable, Logger } from '@nestjs/common';
import { AsyncLocalStorage } from 'async_hooks';
import { MoveRepository } from './move.repository.js';
import {
  AutoCompleteException,
  ConfirmedEstimationMoveInfoException,
  MoveInfoAlreadyExistsException,
  MoveInfoNotFoundException,
  ReceivedEstimationException,
} from './move.exception.js';
import { ForbiddenException, InternalServerErrorException, UnauthorizedException } from '#exceptions/http.exception.js';
import { DriverInvalidTokenException } from '#drivers/driver.exception.js';
import { DriverService } from '#drivers/driver.service.js';
import { EstimationsFilter, IsActivate } from '#types/options.type.js';
import { EstimationRepository } from '#estimations/estimation.repository.js';
import { ConfirmedEstimationException, EstimationNotFoundException } from '#estimations/estimation.exception.js';
import { RequestRepository } from '#requests/request.repository.js';
import { areaToKeyword } from '#utils/address-utils.js';
import { MoveInputDTO, MovePatchInputDTO } from './types/move.dto.js';
import { Cron, CronExpression } from '@nestjs/schedule';
import logger from '#utils/logger.js';
import { PrismaService } from '#global/prisma.service.js';
import { DriverRepository } from '#drivers/driver.repository.js';

@Injectable()
export class MoveService implements IMoveService {
  private readonly logger = logger;

  constructor(
    private readonly driverService: DriverService,
    private readonly driverRepository: DriverRepository,
    private readonly moveRepository: MoveRepository,
    private readonly als: AsyncLocalStorage<IStorage>,
    private readonly estimationRepository: EstimationRepository,
    private readonly requestRepository: RequestRepository,
    private readonly prisma: PrismaService,
  ) {}

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async autoCompleteMoves(): Promise<void> {
    const now = new Date();

    try {
      const updatedComplete = await this.moveRepository.updateToComplete(now);
      this.logger.info(`완료된 이사 ${updatedComplete.count}건 업데이트, 성공 여부: ${updatedComplete.success}`);

      if (updatedComplete.success) {
        const driverIds = await this.moveRepository.driverIdsForCompletedMoves(now);

        if (driverIds.length > 0) {
          await this.driverRepository.updateApplyCount(driverIds);
          this.logger.info(`드라이버 확정 건수 업데이트 완료: ${driverIds.length}건`);
        }
      }

      const expiredMoveInfoIds = await this.moveRepository.updateToExpired(now);
      this.logger.info(`만료된 이사 ${expiredMoveInfoIds.length}건`);

      if (expiredMoveInfoIds.length > 0) {
        const updatedRequestsExpired = await this.requestRepository.updateToRequestExpired(expiredMoveInfoIds);
        this.logger.info(`만료된 요청 ${updatedRequestsExpired.count}건,성공 여부: ${updatedRequestsExpired.success}`);
      }
    } catch (error) {
      this.logger.error(`Error: ${error.message}`, error.stack);
      throw new AutoCompleteException();
    }
  }

  private async getFilteredDriverData(driverId: string) {
    const driver = await this.driverService.findDriver(driverId);
    const isliked = await this.driverService.isLikedDriver(driverId);

    return {
      id: driver.id,
      name: driver.name,
      image: driver.image,
      applyCount: driver.applyCount,
      likeCount: driver.likeCount,
      rating: driver.rating,
      reviewCount: driver.reviewCount,
      career: driver.career,
      isliked: isliked,
    };
  }

  private getMoveInfosWhereCondition(options: MoveInfoGetQueries, driverId: string, driverAvailableAreas: AreaType[]) {
    const { keyword, serviceType, serviceArea, designatedRequest } = options;

    const serviceTypes = serviceType
      ? serviceType
          .split(/[,+\s]/)
          .map(type => type.trim())
          .filter(type => type)
      : undefined;

    const baseWhereCondition = {
      AND: [
        ...(keyword
          ? [
              {
                OR: [
                  { owner: { name: { contains: keyword } } },
                  { fromAddress: { contains: keyword } },
                  { toAddress: { contains: keyword } },
                ],
              },
            ]
          : []),
        ...(serviceTypes?.length
          ? [
              {
                serviceType: { in: serviceTypes },
              },
            ]
          : []),

        ...(serviceArea === IsActivate.Active
          ? [
              {
                OR: [
                  ...driverAvailableAreas.map(area => ({
                    fromAddress: { contains: areaToKeyword(area) },
                  })),
                  ...driverAvailableAreas.map(area => ({
                    toAddress: { contains: areaToKeyword(area) },
                  })),
                ],
              },
            ]
          : []),
        ...(designatedRequest === IsActivate.Active && driverId
          ? [
              {
                requests: {
                  some: {
                    driverId: designatedRequest ? driverId : null,
                  },
                },
              },
            ]
          : []),
        {
          NOT: {
            estimations: {
              some: {
                driverId: driverId,
              },
            },
          },
        },
        { progress: ProgressEnum.OPEN },
      ],
    };

    return baseWhereCondition;
  }

  private getReceivedEstimationsWhereCondition(userId: string) {
    return {
      ownerId: userId,
      progress: { in: [ProgressEnum.EXPIRED, ProgressEnum.CANCELED, ProgressEnum.COMPLETE] },
    };
  }

  async getMoveInfos(options: MoveInfoGetQueries) {
    const { driverId, driver: driverInfo } = this.als.getStore();
    const whereCondition = this.getMoveInfosWhereCondition(options, driverId, driverInfo.availableAreas);

    const list = await this.moveRepository.findMany(options, driverId, whereCondition);
    const totalCount = await this.moveRepository.getTotalCount(whereCondition, false);
    const counts = await this.moveRepository.getFilteringCounts(driverId, driverInfo.availableAreas);

    const moveInfo = { totalCount, counts, list };

    return moveInfo;
  }

  async getMoveInfo(moveInfoId: string) {
    const moveInfo = await this.moveRepository.findByMoveInfoId(moveInfoId);

    if (!moveInfo) {
      throw new MoveInfoNotFoundException();
    }
    const { requests, estimations, ...pureMoveInfo } = moveInfo;
    const moveInfoData = { ...pureMoveInfo };

    return moveInfoData;
  }

  async getUserMoveInfoId() {
    const store = this.als.getStore();
    const userId = store?.userId;

    const moveInfo = await this.moveRepository.findByUserId(userId);

    if (!moveInfo || moveInfo.length === 0) {
      throw new MoveInfoNotFoundException();
    }
    const { id } = moveInfo[0];
    const moveInfoId = { id };

    return moveInfoId;
  }

  async checkMoveInfoExistence() {
    const { userId, type } = this.als.getStore();
    if (type !== UserType.User) {
      throw new DriverInvalidTokenException();
    }

    const moveInfo = await this.moveRepository.findByUserId(userId);

    return { isMoveInfoRegistrable: !moveInfo || moveInfo.length === 0 };
  }

  async getIsMoveInfoEditable(moveInfoId: string) {
    const store = this.als.getStore();
    const userId = store?.userId;
    const type = store?.type;
    if (type !== UserType.User) {
      throw new DriverInvalidTokenException();
    }

    const moveInfo = await this.moveRepository.findByMoveInfoId(moveInfoId);
    if (!moveInfo) {
      throw new MoveInfoNotFoundException();
    }
    if (userId !== moveInfo.ownerId) {
      throw new ForbiddenException();
    }

    const isMoveInfoEditable = moveInfo.estimations.length === 0 ? true : false;

    return { isMoveInfoEditable };
  }

  async getReceivedEstimations(options: moveInfoWithEstimationsGetQueries) {
    const { filter, page, pageSize } = options;
    const paginationOptions = { page, pageSize };
    const { userId } = this.als.getStore();

    const whereCondition = this.getReceivedEstimationsWhereCondition(userId);
    const totalCount = await this.moveRepository.getTotalCount(whereCondition, true);

    const list = await this.moveRepository.findWithEstimationsByUserId(userId, paginationOptions);
    if (list.length === 0) {
      return { totalCount: 0, list: [] };
    }

    const processedMoveInfos = await Promise.all(
      list.map(async moveInfo => ({
        ...moveInfo,
        confirmedEstimation: moveInfo.confirmedEstimation
          ? {
              ...moveInfo.confirmedEstimation,
              driver: await this.getFilteredDriverData(moveInfo.confirmedEstimation.driverId),
              isSpecificRequest: (await this.requestRepository.findByMoveInfoId(moveInfo.confirmedEstimation.moveInfoId)).some(
                req => req.driverId === moveInfo.confirmedEstimation.driverId,
              ),
            }
          : null,
        estimations:
          filter === EstimationsFilter.confirmed
            ? []
            : await Promise.all(
                moveInfo.estimations
                  .filter(estimation => estimation.id !== moveInfo.confirmedEstimation?.id)
                  .map(async estimation => ({
                    ...estimation,
                    driver: await this.getFilteredDriverData(estimation.driverId),
                    isSpecificRequest: (await this.requestRepository.findByMoveInfoId(estimation.moveInfoId)).some(
                      req => req.driverId === estimation.driverId,
                    ),
                  })),
              ),
      })),
    );
    return { totalCount, list: processedMoveInfos };
  }

  async postMoveInfo(moveData: MoveInputDTO) {
    const { userId } = this.als.getStore();
    if (!userId) {
      throw new UnauthorizedException();
    }

    const existingMoveCount = await this.moveRepository.countByUserId(userId);
    if (existingMoveCount > 0) {
      throw new MoveInfoAlreadyExistsException();
    }

    const progress = ProgressEnum.OPEN;

    try {
      const moveInfo = await this.moveRepository.postMoveInfo({
        ...moveData,
        ownerId: userId,
        progress,
      });

      return moveInfo;
    } catch (error) {
      throw new InternalServerErrorException('이사 정보 생성 중 오류가 발생했습니다.');
    }
  }

  async patchMoveInfo(moveInfoId: string, body: MovePatchInputDTO) {
    const { userId } = this.als.getStore();
    const moveInfo = await this.moveRepository.findByMoveInfoId(moveInfoId);

    if (!moveInfo) {
      throw new MoveInfoNotFoundException();
    }
    if (userId !== moveInfo.ownerId) {
      throw new ForbiddenException();
    }
    if (moveInfo.estimations.length > 0) {
      throw new ReceivedEstimationException();
    }

    const updatedMoveInfo = await this.moveRepository.update(moveInfoId, body);

    return updatedMoveInfo;
  }

  async softDeleteMoveInfo(moveInfoId: string) {
    const { userId } = this.als.getStore();
    const moveInfo = await this.moveRepository.findByMoveInfoId(moveInfoId);

    if (!moveInfo) {
      throw new MoveInfoNotFoundException();
    }
    if (moveInfo.ownerId !== userId) {
      throw new ForbiddenException();
    }
    if (moveInfo.confirmedEstimationId) {
      throw new ConfirmedEstimationMoveInfoException();
    }

    return await this.prisma.$transaction(async () => {
      const softDeleteMoveInfo = await this.moveRepository.softDeleteMoveInfo(moveInfoId);

      if (moveInfo.requests?.length > 0) {
        await Promise.all(
          moveInfo.requests.map(request => this.requestRepository.update(request.id, { status: StatusEnum.CANCELED })),
        );
      }

      return softDeleteMoveInfo;
    });
  }

  async confirmEstimation(moveInfoId: string, estimationId: string): Promise<void> {
    const { userId } = this.als.getStore();

    // 1. 이사 정보 찾기
    const moveInfo = await this.moveRepository.findMoveInfoById(moveInfoId);
    if (!moveInfo) {
      throw new MoveInfoNotFoundException();
    }

    if (moveInfo.ownerId !== userId) {
      throw new ForbiddenException();
    }

    // 2. 이미 확정된 견적이 있는지 확인
    const isConfirmed = await this.moveRepository.checkConfirmedEstimation(moveInfoId);

    if (isConfirmed) {
      throw new ConfirmedEstimationException();
    }

    // 3. 해당 이사 정보에 연결된 견적 찾기 (해당 이사정보와 연결된 견적인지 확인)
    const estimation = await this.estimationRepository.findEstimationByMoveInfo(moveInfoId, estimationId);

    if (!estimation) {
      console.error('견적 정보가 없습니다.');

      throw new EstimationNotFoundException();
    }

    // 4. 이사 정보 업데이트하기 (확정된 견적 ID 등록 + 상태 업데이트)
    //  await this.moveRepository.confirmEstimation(moveInfoId, estimationId);

    this.moveRepository.confirmEstimation(moveInfoId, estimationId);
    this.estimationRepository.confirmedForIdEstimation(estimationId, moveInfoId);

    this.logger.info(`이사 정보(${moveInfoId})에 대해 견적(${estimationId})을 확정했습니다.`);
  }
}

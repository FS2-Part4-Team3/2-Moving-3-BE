import { IMoveService } from '#move/interfaces/move.service.interface.js';
import { AreaType, IStorage, UserType } from '#types/common.types.js';
import { MoveInfoGetQueries, moveInfoWithEstimationsGetQueries } from '#types/queries.type.js';
import { Injectable, Logger } from '@nestjs/common';
import { AsyncLocalStorage } from 'async_hooks';
import { MoveRepository } from './move.repository.js';
import { MoveInfoNotFoundException, ReceivedEstimationException } from './move.exception.js';
import { Progress } from '@prisma/client';
import { ForbiddenException, InternalServerErrorException } from '#exceptions/http.exception.js';
import { DriverInvalidTokenException } from '#drivers/driver.exception.js';
import { DriverService } from '#drivers/driver.service.js';
import { EstimationsFilter, IsActivate } from '#types/options.type.js';
import { EstimationRepository } from '#estimations/estimation.repository.js';
import { ConfirmedEstimationException, EstimationNotFoundException } from '#estimations/estimation.exception.js';
import { RequestRepository } from '#requests/request.repository.js';
import { areaToKeyword } from '#utils/address-utils.js';
import { MoveInputDTO, MovePatchInputDTO } from './types/move.dto.js';
import { Cron, CronExpression } from '@nestjs/schedule';

@Injectable()
export class MoveService implements IMoveService {
  private readonly logger = new Logger(MoveService.name);

  constructor(
    private readonly driverService: DriverService,
    private readonly moveRepository: MoveRepository,
    private readonly als: AsyncLocalStorage<IStorage>,
    private readonly estimationRepository: EstimationRepository,
    private readonly requestRepository: RequestRepository,
  ) {}

  // @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async autoCompleteMoves() {
    const now = new Date();

    console.log('자동만료~~~~~~~');

    try {
      console.log('updateToComplete 실행 중...');
      const updatedComplete = await this.moveRepository.updateToComplete(now);
      this.logger.log(`완료된 이사 ${updatedComplete.count}건 업데이트`);

      console.log('updateToExpired 실행 중...');
      const expiredMoveInfoIds = await this.moveRepository.updateToExpired(now);
      this.logger.log(`만료된 이사 ${expiredMoveInfoIds.length}건`);

      if (expiredMoveInfoIds.length > 0) {
        console.log('updateToRequestExpired 실행 중...');
        const updatedRequestsExpired = await this.requestRepository.updateToRequestExpired(expiredMoveInfoIds);
        this.logger.log(`만료된 요청 ${updatedRequestsExpired.count}건`);
      } else {
        console.log('만료된 이사 없음 업데이트 불가능');
      }
    } catch (error) {
      console.error('autoCompleteMoves:', error);
      this.logger.error(`Error: ${error.message}`, error.stack);
      throw new InternalServerErrorException('자동 완료 중 오류가 발생했습니다.');
    }

    // // 'CONFIRMED' 상태에서 진행된 이사는 'COMPLETE'로 바꾸기
    // const updatedComplete = await this.moveRepository.updateToComplete(now);
    // this.logger.log(`Auto-completed ${updatedComplete.count} moves to COMPLETE.`);
    // console.log('updateToComplete 완료:', updatedComplete);

    // // 'OPEN' 상태에서 'EXPIRED'로 변경된 MoveInfo의 ID 목록을 바로 받아오기
    // const expiredMoveInfoIds = await this.moveRepository.updateToExpired(now);
    // this.logger.log(`Auto-expired ${expiredMoveInfoIds.length} moves.`);
    // console.log('findExpiredMoveInfoIds 완료:', expiredMoveInfoIds);

    // // 'EXPIRED'인 MoveInfo에 연결된 Request들도 'EXPIRED'로 변경
    // const updatedRequestsExpired = await this.requestRepository.updateToRequestExpired(expiredMoveInfoIds);
    // this.logger.log(`Auto-expired ${updatedRequestsExpired.count} requests.`);
    // console.log('updateToRequestExpired 완료:', updatedRequestsExpired);
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
        { progress: Progress.OPEN },
      ],
    };

    return baseWhereCondition;
  }

  private getReceivedEstimationsWhereCondition(userId: string) {
    return {
      ownerId: userId,
      progress: { in: [Progress.CANCELED, Progress.COMPLETE] },
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

    return moveInfo;
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
    const progress = Progress.OPEN;
    const moveInfo = await this.moveRepository.postMoveInfo({
      ...moveData,
      ownerId: userId,
      progress,
    });

    return moveInfo;
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

    const softDeleteMoveInfo = await this.moveRepository.softDeleteMoveInfo(moveInfoId);

    return softDeleteMoveInfo;
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
  }
}

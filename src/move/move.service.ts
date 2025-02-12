import { IMoveService } from '#move/interfaces/move.service.interface.js';
import { AreaType, IStorage, UserType } from '#types/common.types.js';
import { MoveInfoGetQueries, moveInfoWithEstimationsGetQueries } from '#types/queries.type.js';
import { Injectable } from '@nestjs/common';
import { AsyncLocalStorage } from 'async_hooks';
import { MoveRepository } from './move.repository.js';
import { MoveInfoNotFoundException, ReceivedEstimationException } from './move.exception.js';
import { Progress } from '@prisma/client';
import { MoveInfo, MoveInfoInputDTO } from './move.types.js';
import { ForbiddenException, InternalServerErrorException, NotFoundException } from '#exceptions/http.exception.js';
import { DriverInvalidTokenException } from '#drivers/driver.exception.js';
import { DriverService } from '#drivers/driver.service.js';
import { EstimationsFilter, IsActivate } from '#types/options.type.js';
import { EstimationRepository } from '#estimations/estimation.repository.js';
import { ConfirmedEstimationException, EstimationNotFoundException } from '#estimations/estimation.exception.js';
import { PrismaService } from '#global/prisma.service.js';
import { RequestRepository } from '#requests/request.repository.js';
import { areaToKeyword } from '#utils/address-utils.js';

@Injectable()
export class MoveService implements IMoveService {
  constructor(
    private readonly driverService: DriverService,
    private readonly moveRepository: MoveRepository,
    private readonly als: AsyncLocalStorage<IStorage>,
    private readonly estimationRepository: EstimationRepository,
    private readonly requestRepository: RequestRepository,
  ) {}

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

  async getMoveInfo(moveId: string) {
    const moveInfo = await this.moveRepository.findByMoveInfoId(moveId);

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

  async getIsMoveInfoEditable(moveId: string) {
    const store = this.als.getStore();
    const userId = store?.userId;
    const type = store?.type;
    if (type !== UserType.User) {
      throw new DriverInvalidTokenException();
    }

    const moveInfo = await this.moveRepository.findByMoveInfoId(moveId);
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

  async postMoveInfo(moveData: MoveInfoInputDTO): Promise<MoveInfo> {
    const { userId } = this.als.getStore();
    const progress = Progress.OPEN;
    const moveInfo = await this.moveRepository.postMoveInfo({
      ...moveData,
      ownerId: userId,
      progress,
    });

    return moveInfo;
  }

  async patchMoveInfo(moveId: string, body: Partial<MoveInfoInputDTO>) {
    const { userId } = this.als.getStore();
    const moveInfo = await this.moveRepository.findByMoveInfoId(moveId);

    if (!moveInfo) {
      throw new MoveInfoNotFoundException();
    }
    if (userId !== moveInfo.ownerId) {
      throw new ForbiddenException();
    }
    if (moveInfo.estimations.length > 0) {
      throw new ReceivedEstimationException();
    }

    const updatedMoveInfo = await this.moveRepository.update(moveId, body);

    return updatedMoveInfo;
  }

  async softDeleteMoveInfo(moveId: string) {
    const { userId } = this.als.getStore();
    const moveInfo = await this.moveRepository.findByMoveInfoId(moveId);

    if (!moveInfo) {
      throw new MoveInfoNotFoundException();
    }
    if (moveInfo.ownerId !== userId) {
      throw new ForbiddenException();
    }

    const softDeleteMoveInfo = await this.moveRepository.softDeleteMoveInfo(moveId);

    return softDeleteMoveInfo;
  }

  async confirmEstimation(moveInfoId: string, estimationId: string) {
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

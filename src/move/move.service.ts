import { IMoveService } from '#move/interfaces/move.service.interface.js';
import { IStorage, UserType } from '#types/common.types.js';
import { MoveInfoGetQueries } from '#types/queries.type.js';
import { Injectable } from '@nestjs/common';
import { AsyncLocalStorage } from 'async_hooks';
import { MoveRepository } from './move.repository.js';
import { MoveInfoNotFoundException, ReceivedEstimationException } from './move.exception.js';
import { Progress } from '@prisma/client';
import { MoveInfo, MoveInfoInputDTO } from './move.types.js';
import { ForbiddenException } from '#exceptions/http.exception.js';
import { DriverInvalidTokenException } from '#drivers/driver.exception.js';
import { DriverService } from '#drivers/driver.service.js';
import { EstimationsFilter } from '#types/options.type.js';

@Injectable()
export class MoveService implements IMoveService {
  constructor(
    private readonly driverService: DriverService,
    private readonly moveRepository: MoveRepository,
    private readonly als: AsyncLocalStorage<IStorage>,
  ) {}

  private async getFilteredDriverData(driverId: string) {
    const driver = await this.driverService.findDriver(driverId);

    return {
      id: driver.id,
      name: driver.name,
      image: driver.image,
      applyCount: driver.applyCount,
      likeCount: driver.likeCount,
      rating: driver.rating,
      reviewCount: driver.reviewCount,
      career: driver.career,
    };
  }

  async getMoveInfos(options: MoveInfoGetQueries) {
    const { driverId, driver: driverInfo } = this.als.getStore();

    const list = await this.moveRepository.findMany(options, driverId, driverInfo.availableAreas);
    const totalCount = await this.moveRepository.getTotalCount(options, driverId, driverInfo.availableAreas);
    const counts = await this.moveRepository.getFilteringCounts(driverId, driverInfo.availableAreas);

    const moveInfo = { totalCount, counts, list };

    return moveInfo;
  }

  async getMoveInfo(moveInfoId: string) {
    const moveInfo = await this.moveRepository.findByMoveInfoId(moveInfoId);

    if (!moveInfo) {
      throw new MoveInfoNotFoundException();
    }

    return moveInfo;
  }

  async checkMoveInfoExistence() {
    const { userId, type } = this.als.getStore();
    if (type !== UserType.User) {
      throw new DriverInvalidTokenException();
    }

    const moveInfo = await this.moveRepository.findByUserId(userId);

    return moveInfo;
  }

  async getReceivedEstimations(filter: EstimationsFilter) {
    const { userId } = this.als.getStore();

    const moveInfos = await this.moveRepository.findWithEstimationsByUserId(userId);

    return await Promise.all(
      moveInfos.map(async moveInfo => ({
        ...moveInfo,
        confirmedEstimation: moveInfo.confirmedEstimation
          ? {
              ...moveInfo.confirmedEstimation,
              driver: await this.getFilteredDriverData(moveInfo.confirmedEstimation.driverId),
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
                  })),
              ),
      })),
    );
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
}

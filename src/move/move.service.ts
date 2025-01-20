import { IMoveService } from '#move/interfaces/move.service.interface.js';
import { IStorage } from '#types/common.types.js';
import { MoveInfoGetQueries } from '#types/queries.type.js';
import { Injectable } from '@nestjs/common';
import { AsyncLocalStorage } from 'async_hooks';
import { MoveRepository } from './move.repository.js';
import { MoveInfoNotFoundException, ReceivedEstimationException } from './move.exception.js';
import { Progress } from '@prisma/client';
import { MoveInfo, MoveInfoInputDTO } from './move.types.js';
import { ForbiddenException } from '#exceptions/http.exception.js';

@Injectable()
export class MoveService implements IMoveService {
  constructor(
    private readonly moveRepository: MoveRepository,
    private readonly als: AsyncLocalStorage<IStorage>,
  ) {}

  async getMoveInfos(options: MoveInfoGetQueries) {
    const { driverId, driver: driverInfo } = this.als.getStore();

    const moveInfo = await this.moveRepository.findMany(options, driverId, driverInfo.availableAreas);

    return moveInfo;
  }

  async getMoveInfo(moveInfoId: string) {
    const moveInfo = await this.moveRepository.findByMoveInfoId(moveInfoId);

    if (!moveInfo) {
      throw new MoveInfoNotFoundException();
    }

    return moveInfo;
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
}

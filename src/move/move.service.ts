import { IMoveService } from '#move/interfaces/move.service.interface.js';
import { IStorage } from '#types/common.types.js';
import { MoveInfoGetQueries } from '#types/queries.type.js';
import { Injectable } from '@nestjs/common';
import { AsyncLocalStorage } from 'async_hooks';
import { MoveRepository } from './move.repository.js';
import { MoveInfoNotFoundException } from './move.exception.js';

@Injectable()
export class MoveService implements IMoveService {
  constructor(
    private readonly moveRepository: MoveRepository,
    private readonly als: AsyncLocalStorage<IStorage>,
  ) {}

  async getMoveInfos(options: MoveInfoGetQueries) {
    const { driverId, driver: driverInfo } = this.als.getStore();

    const { list, totalCount } = await this.moveRepository.findMany(options, driverId, driverInfo.availableAreas);

    return { totalCount, list };
  }

  async getMoveInfo(moveInfoId: string) {
    const moveInfo = await this.moveRepository.findByMoveInfoId(moveInfoId);

    if (!moveInfo) {
      throw new MoveInfoNotFoundException();
    }

    return moveInfo;
  }
}

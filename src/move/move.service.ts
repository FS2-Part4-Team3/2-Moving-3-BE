import { IMoveService } from '#move/interfaces/move.service.interface.js';
import { IStorage } from '#types/common.types.js';
import { FindOptions, RequestFilter } from '#types/options.type.js';
import { Injectable } from '@nestjs/common';
import { AsyncLocalStorage } from 'async_hooks';
import { MoveRepository } from './move.repository.js';

@Injectable()
export class MoveService implements IMoveService {
  constructor(
    private readonly moveRepository: MoveRepository,
    private readonly als: AsyncLocalStorage<IStorage>,
  ) {}

  async getMoveInfos(driverId?: string, options?: FindOptions & RequestFilter) {
    const { list, totalCount } = await this.moveRepository.findMany(options, driverId);

    return { totalCount, list };
  }

  async getMoveInfo() {
    const { userId } = this.als.getStore();
    const moveInfo = await this.moveRepository.findByUserId(userId);

    return moveInfo;
  }
}

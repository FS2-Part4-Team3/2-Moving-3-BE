import { IMoveService } from '#move/interfaces/move.service.interface.js';
import { IStorage } from '#types/common.types.js';
import { Injectable } from '@nestjs/common';
import { AsyncLocalStorage } from 'async_hooks';
import { MoveRepository } from './move.repository.js';

@Injectable()
export class MoveService implements IMoveService {
  constructor(
    private readonly moveRepository: MoveRepository,
    private readonly als: AsyncLocalStorage<IStorage>,
  ) {}

  async getMoveInfo() {
    const { userId } = this.als.getStore();
    const moveInfo = await this.moveRepository.findById(userId);

    return moveInfo;
  }
}

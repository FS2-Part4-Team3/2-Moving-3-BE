import { IMoveService } from '#move/interfaces/move.service.interface.js';
import { FindOptions, RequestFilter } from '#types/options.type.js';
import { Injectable } from '@nestjs/common';
import { MoveRepository } from './move.repository.js';

@Injectable()
export class MoveService implements IMoveService {
  constructor(private readonly moveRepository: MoveRepository) {}

  async getMoveInfos(driverId?: string, options?: FindOptions & RequestFilter) {
    const { list, totalCount } = await this.moveRepository.findMany(options, driverId);

    return { totalCount, list };
  }
}

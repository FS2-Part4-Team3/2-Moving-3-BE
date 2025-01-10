import { IRequestService } from '#requests/interfaces/request.service.interface.js';
import { Injectable } from '@nestjs/common';
import { RequestRepository } from './request.repository.js';
import { AsyncLocalStorage } from 'async_hooks';
import { IStorage } from '#types/common.types.js';
import { Status } from '@prisma/client';
import { MoveRepository } from '#move/move.repository.js';
import { MoveInfoNotFoundException } from './request.exception.js';

@Injectable()
export class RequestService implements IRequestService {
  constructor(
    private readonly moveRepository: MoveRepository,
    private readonly requestRepository: RequestRepository,
    private readonly als: AsyncLocalStorage<IStorage>,
  ) {}

  async getRequest(id: string) {
    const request = await this.requestRepository.findById(id);

    return request;
  }

  async postRequest(driverId: string) {
    const { userId } = this.als.getStore();

    const moveInfo = await this.moveRepository.findById(userId);

    if (!moveInfo || moveInfo.length === 0) {
      throw new MoveInfoNotFoundException();
    }

    const data = { moveInfoId: moveInfo[0].id, status: Status.PENDING, driverId: driverId };

    const request = await this.requestRepository.create(data);

    return request;
  }
}

import { MoveRepository } from '#move/move.repository.js';
import { IRequestService } from '#requests/interfaces/request.service.interface.js';
import { IStorage } from '#types/common.types.js';
import { Injectable } from '@nestjs/common';
import { Status } from '@prisma/client';
import { AsyncLocalStorage } from 'async_hooks';
import { MoveInfoNotFoundException } from './request.exception.js';
import { ForbiddenException } from '#exceptions/http.exception.js';
import { RequestRepository } from './request.repository.js';

@Injectable()
export class RequestService implements IRequestService {
  constructor(
    private readonly moveRepository: MoveRepository,
    private readonly requestRepository: RequestRepository,
    private readonly als: AsyncLocalStorage<IStorage>,
  ) {}

  async getRequest(requestId: string) {
    const request = await this.requestRepository.findById(requestId);

    return request;
  }

  async postRequest(driverId: string) {
    const { userId } = this.als.getStore();

    const moveInfo = await this.moveRepository.findByUserId(userId);

    if (moveInfo.ownerId !== userId) {
      throw new ForbiddenException();
    }

    if (!moveInfo || moveInfo.length === 0) {
      throw new MoveInfoNotFoundException();
    }

    const data = { moveInfoId: moveInfo[0].id, status: Status.PENDING, driverId: driverId };

    const request = await this.requestRepository.create(data);

    return request;
  }

  async deleteRequest(requestId: string) {
    const { userId } = this.als.getStore();
    const requestInfo = await this.requestRepository.findById(requestId);
    if (requestInfo.moveInfo.ownerId !== userId) {
      throw new ForbiddenException();
    }

    const request = await this.requestRepository.delete(requestId);

    return request;
  }
}

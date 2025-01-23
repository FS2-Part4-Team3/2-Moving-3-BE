import { MoveRepository } from '#move/move.repository.js';
import { IRequestService } from '#requests/interfaces/request.service.interface.js';
import { IStorage } from '#types/common.types.js';
import { Injectable } from '@nestjs/common';
import { Status } from '@prisma/client';
import { AsyncLocalStorage } from 'async_hooks';
import { RequestNotFoundException } from './request.exception.js';
import { ForbiddenException } from '#exceptions/http.exception.js';
import { RequestRepository } from './request.repository.js';
import { MoveInfoNotFoundException } from '#move/move.exception.js';

@Injectable()
export class RequestService implements IRequestService {
  constructor(
    private readonly moveRepository: MoveRepository,
    private readonly requestRepository: RequestRepository,
    private readonly als: AsyncLocalStorage<IStorage>,
  ) {}

  async getRequest(requestId: string) {
    const request = await this.requestRepository.findById(requestId);

    if (!request) {
      throw new RequestNotFoundException();
    }

    return request;
  }

  async checkRequest(driverId: string) {
    const { userId } = this.als.getStore();

    const moveInfo = await this.moveRepository.findByUserId(userId);
    if (!moveInfo) {
      throw new MoveInfoNotFoundException();
    }

    const requests = moveInfo[0].requests ? moveInfo[0].requests : [];
    if (!requests || requests.length === 0) {
      return { isRequestPossible: true };
    }
    const isRequestPossible = requests.some(request => request.driverId === driverId);

    return { isRequestPossible: !isRequestPossible };
  }

  async postRequest(driverId: string) {
    const { userId } = this.als.getStore();

    const moveInfo = await this.moveRepository.findByUserId(userId);

    if (!moveInfo || moveInfo[0].length === 0) {
      throw new MoveInfoNotFoundException();
    }

    if (moveInfo[0].ownerId !== userId) {
      throw new ForbiddenException();
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

import { MoveRepository } from '#move/move.repository.js';
import { IRequestService } from '#requests/interfaces/request.service.interface.js';
import { IStorage, StatusEnum } from '#types/common.types.js';
import { Injectable } from '@nestjs/common';
import { AsyncLocalStorage } from 'async_hooks';
import { AlreadyRequestedException, RequestNotFoundException } from './request.exception.js';
import { ForbiddenException } from '#exceptions/http.exception.js';
import { RequestRepository } from './request.repository.js';
import { MoveInfoNotFoundException } from '#move/move.exception.js';
import { CreateRequestDTO } from './types/request.dto.js';

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

    const { moveInfoId } = request;
    const { ownerId: moveinfoOwnerId } = await this.moveRepository.findByMoveInfoId(moveInfoId);

    const requsetDetail = { ...request, moveinfoOwnerId };

    return requsetDetail;
  }

  async checkRequest(driverId: string) {
    const { userId } = this.als.getStore();

    const moveInfo = await this.moveRepository.findByUserId(userId);
    if (!moveInfo) {
      throw new MoveInfoNotFoundException();
    }

    const requests = await this.requestRepository.findByMoveInfoId(moveInfo[0].id);
    if (!requests || requests.length === 0) {
      return { isRequestPossible: true };
    }
    const isRequestPossible = requests.some(request => request.driverId === driverId);

    return { isRequestPossible: !isRequestPossible };
  }

  async postRequest(driverId: string) {
    const { userId } = this.als.getStore();

    const moveInfo = await this.moveRepository.findByUserId(userId);
    if (!moveInfo || moveInfo.length === 0) {
      throw new MoveInfoNotFoundException();
    }

    if (moveInfo[0].ownerId !== userId) {
      throw new ForbiddenException();
    }

    const requests = await this.requestRepository.findByMoveInfoId(moveInfo[0].id);
    const isRequestPossible = requests.some(request => request.driverId === driverId);
    if (isRequestPossible) {
      throw new AlreadyRequestedException();
    }

    const data: CreateRequestDTO = { moveInfoId: moveInfo[0].id, status: StatusEnum.PENDING, driverId: driverId };

    const request = await this.requestRepository.create(data);

    return request;
  }

  async deleteRequest(requestId: string) {
    const { userId } = this.als.getStore();
    const requestInfo = await this.requestRepository.findById(requestId);
    if (!requestInfo) {
      throw new RequestNotFoundException();
    }
    if (requestInfo.moveInfo.ownerId !== userId) {
      throw new ForbiddenException();
    }

    const request = await this.requestRepository.delete(requestId);

    return request;
  }
}

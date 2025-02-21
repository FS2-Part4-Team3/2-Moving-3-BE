import { MoveRepository } from '#move/move.repository.js';
import { IRequestService } from '#requests/interfaces/request.service.interface.js';
import { IStorage, StatusEnum } from '#types/common.types.js';
import { Injectable } from '@nestjs/common';
import { AsyncLocalStorage } from 'async_hooks';
import { AlreadyRequestedException, EstimationAlreadyReceivedException, RequestNotFoundException } from './request.exception.js';
import { ForbiddenException } from '#exceptions/http.exception.js';
import { RequestRepository } from './request.repository.js';
import { MoveInfoNotFoundException } from '#move/move.exception.js';
import { CreateRequestDTO } from './types/request.dto.js';
import { EstimationRepository } from '#estimations/estimation.repository.js';

@Injectable()
export class RequestService implements IRequestService {
  constructor(
    private readonly moveRepository: MoveRepository,
    private readonly requestRepository: RequestRepository,
    private readonly estimationRepository: EstimationRepository,
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
    if (!moveInfo || moveInfo.length === 0) {
      throw new MoveInfoNotFoundException();
    }

    const moveInfoId = moveInfo[0].id;

    const requests = (await this.requestRepository.findByMoveInfoId(moveInfoId)) || [];
    if (requests.some(request => request.driverId === driverId)) {
      return { isRequestPossible: false, reason: '이미 지정견적 요청을 보냈습니다.' };
    }

    const estimations = (await this.estimationRepository.findByMoveInfoId(moveInfoId)) || [];
    if (estimations.some(estimation => estimation.driverId === driverId)) {
      return { isRequestPossible: false, reason: '이미 해당 기사로부터 견적을 받았습니다.' };
    }

    return { isRequestPossible: true, reason: '지정견적 요청이 가능합니다.' };
  }

  async postRequest(driverId: string) {
    const { userId } = this.als.getStore();

    const moveInfo = await this.moveRepository.findByUserId(userId);
    if (!moveInfo || moveInfo.length === 0) {
      throw new MoveInfoNotFoundException();
    }

    const currentMoveInfo = moveInfo[0];
    if (currentMoveInfo.ownerId !== userId) {
      throw new ForbiddenException();
    }

    const requests = await this.requestRepository.findByMoveInfoId(currentMoveInfo.id);
    const isRequestPossible = requests.some(request => request.driverId === driverId);
    if (isRequestPossible) {
      throw new AlreadyRequestedException();
    }

    const estimations = await this.estimationRepository.findByMoveInfoId(currentMoveInfo.id);
    const isEstimationAlreadyExist = estimations.some(estimation => estimation.driverId === driverId);
    if (isEstimationAlreadyExist) {
      throw new EstimationAlreadyReceivedException();
    }

    const data: CreateRequestDTO = { moveInfoId: currentMoveInfo.id, status: StatusEnum.PENDING, driverId: driverId };

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

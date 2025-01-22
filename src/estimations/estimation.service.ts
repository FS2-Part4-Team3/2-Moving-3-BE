import { IEstimationService } from '#estimations/interfaces/estimation.service.interface.js';
import { EstimationRepository } from '#estimations/estimation.repository.js';
import { EstimationInputDTO, Estimation } from '#estimations/estimation.types.js';
import { Injectable } from '@nestjs/common';
import { IStorage } from '#types/common.types.js';
import { AsyncLocalStorage } from 'async_hooks';
import { MoveRepository } from '#move/move.repository.js';
import { RequestRepository } from '#requests/request.repository.js';
import { IMoveInfo } from '#move/types/move.types.js';
import { EstimateAlreadyExistsException, PendingRequestNotFoundException } from './estimation.exception.js';
import { RequestRejectedException } from './estimation.exception.js';
import { Prisma } from '@prisma/client';
import { DriverNotFoundException } from '#drivers/driver.exception.js';
import { MoveInfoNotFoundException } from '#move/move.exception.js';

@Injectable()
export class EstimationService implements IEstimationService {
  constructor(
    private readonly estimationRepository: EstimationRepository,
    private readonly moveRepository: MoveRepository,
    private readonly requestRepository: RequestRepository,
    private readonly als: AsyncLocalStorage<IStorage>,
  ) {}

  // 견적 생성 메서드
  async createEstimation(
    moveInfoId: string,
    estimationData: EstimationInputDTO,
    reject: boolean = false,
  ): Promise<Estimation | { message: string }> {
    const { driverId } = this.als.getStore();

    if (!driverId) {
      throw new DriverNotFoundException();
    }

    //이사 정보 조회하기
    const moveInfo = await this.moveRepository.findByMoveInfoId(moveInfoId);
    if (!moveInfo) {
      throw new MoveInfoNotFoundException();
    }

    // 드라이버가 이미 견적을 제출했는지
    const existingEstimation = moveInfo.estimations.some(estimate => estimate.driverId === driverId);
    if (existingEstimation) {
      throw new EstimateAlreadyExistsException();
    }

    // 지정 요청이 있는지 확인 여기 find 여야하나..?
    const isDesignatedRequest = moveInfo.requests.some(request => request.driverId === driverId && request.status === 'PENDING');

    if (isDesignatedRequest) {
      return this.handleDesignatedRequest(moveInfo, estimationData, driverId);
    } else {
      // 일반 견적 생성
      return this.handleGeneralEstimation(moveInfo, estimationData, driverId);
    }
  }
  // 지정 요청 견적 생성
  private async handleDesignatedRequest(
    moveInfo: IMoveInfo,
    estimationData: EstimationInputDTO,
    driverId: string,
  ): Promise<Estimation | { message: string }> {
    const pendingRequest = moveInfo.requests.find(request => request.status === 'PENDING' && request.driverId === driverId);

    if (!pendingRequest) {
      return this.handleGeneralEstimation(moveInfo, estimationData, driverId);
    }

    if (!estimationData.price) {
      // 코멘트만 있을 경우: 반려
      await this.requestRepository.update(pendingRequest.id, { status: 'REJECTED' });
      throw new RequestRejectedException();
    } else {
      // 코멘트와 가격이 있을 경우: 승인
      await this.requestRepository.update(pendingRequest.id, { status: 'APPLY' });
    }

    // 견적 생성
    const data = {
      ...estimationData,
      moveInfoId: moveInfo.id,
      driverId: driverId,
      price: estimationData.price ?? null,
    };
    return this.estimationRepository.create(data);
  }

  // 일반 견적 생성
  private async handleGeneralEstimation(
    moveInfo: IMoveInfo,
    estimationData: EstimationInputDTO,
    driverId: string,
  ): Promise<Estimation> {
    const data = {
      ...estimationData,
      moveInfoId: moveInfo.id,
      driverId: driverId,
    };
    return this.estimationRepository.create(data);
  }
}

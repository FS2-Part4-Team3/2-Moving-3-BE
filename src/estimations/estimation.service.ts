import { IEstimationService } from '#estimations/interfaces/estimation.service.interface.js';
import { EstimationRepository } from '#estimations/estimation.repository.js';
import { EstimationInputDTO, Estimation, EstimationEntity } from '#estimations/estimation.types.js';
import { Injectable } from '@nestjs/common';
import { IStorage } from '#types/common.types.js';
import { AsyncLocalStorage } from 'async_hooks';
import { MoveRepository } from '#move/move.repository.js';
import { RequestRepository } from '#requests/request.repository.js';
import { Progress, RequestStatus } from '#move/types/move.types.js';
import { EstimateAlreadyExistsException } from './estimation.exception.js';
import { MoveInfo } from '@prisma/client';

@Injectable()
export class EstimationService implements IEstimationService {
  constructor(
    private readonly estimationRepository: EstimationRepository,
    private readonly moveRepository: MoveRepository,
    private readonly requestRepository: RequestRepository,
    private readonly als: AsyncLocalStorage<IStorage>,
  ) {}

  // 견적 생성
  async createEstimation(moveInfoId: string) {
    const { driverId } = this.als.getStore();
    if (!driverId) {
      throw new Error('Driver ID not found in the current context.');
    }

    const moveInfo = await this.moveRepository.findByMoveInfoId(moveInfoId);
    if (!moveInfo) {
      throw new Error(`MoveInfo with ID ${moveInfoId} not found.`);
    }

    //지정 요청인지 확인하기
    const isDesignatedRequest = moveInfo.requests.some(request => request.driverId === driverId);

    if (isDesignatedRequest) {
      const existingEstimation = moveInfo.estimations.find(estimate => estimate.driverId === driverId);
      if (existingEstimation) {
        throw new EstimateAlreadyExistsException();
      }
      // moveinfo에 requests 배열에서 pending 상태+ driverid 찾기
      const pendingRequest = moveInfo.requests.find(request => request.status === 'PENDING' && request.driverId === driverId);
      if (pendingRequest) {
        await this.requestRepository.update(pendingRequest.id, { status: 'APPLY' });
      }

      // 중복 견적 확인하기
      if (moveInfo.estimations.some(estimate => estimate.driverId === driverId)) {
        throw new EstimateAlreadyExistsException();
      }

      const data = {
        moveInfoId: moveInfo.id,
        driverId: driverId,
      };

      // 견적을.. 무브인포에?
      const newEstimation = await this.estimationRepository.create(data);
    }

    //견적 생성
    // async createEstimation(moveInfoId: string, data: EstimationInputDTO): Promise<Estimation> {
    //   const { driverId } = this.als.getStore();
    //   const moveInfo = await this.moveRepository.findByMoveInfoId(moveInfoId);
    //   console.log(driverId);
    //   console.log(moveInfo);
    //   const abc = { ...data, moveInfoId, driverId };

    // if (moveInfo.estimations.some(estimate => estimate.driverId === driverId)) {
    //   throw new EstimateAlreadyExistsException();
    // }

    // if (moveInfo.progress === Progress.OPEN) {
    //   // 일반요청
    //   return this.estimationRepository.create(data);
    // }

    // // 지정요청 PENDING
    // let afterRequestStatus = RequestStatus.APPLY;
    // if (data.isRejected) {
    //   // 반려
    //   afterRequestStatus = RequestStatus.REJECTED;
    // }
    // TODO: transaction

    // const pendingRequest = moveInfo.requests.find(request => request.status === RequestStatus.PENDING);
    // console.log(pendingRequest);

    // await this.requestRepository.update(pendingRequest.id, { status: afterRequestStatus });

    return await this.estimationRepository.create(abc);
  }
}

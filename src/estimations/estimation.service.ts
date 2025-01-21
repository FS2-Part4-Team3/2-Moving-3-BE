import { IEstimationService } from '#estimations/interfaces/estimation.service.interface.js';
import { EstimationRepository } from '#estimations/estimation.repository.js';
import { EstimationInputDTO, Estimation } from '#estimations/estimation.types.js';
import { Injectable } from '@nestjs/common';
import { IStorage } from '#types/common.types.js';
import { AsyncLocalStorage } from 'async_hooks';
import { MoveRepository } from '#move/move.repository.js';
import { RequestRepository } from '#requests/request.repository.js';
import { IMoveInfo, Progress, RequestStatus } from '#move/types/move.types.js';
import { EstimateAlreadyExistsException } from './estimation.exception.js';
import { RequestRejectedException, MoveInfoNotOpenException } from './estimation.exception.js';
import { Prisma } from '@prisma/client';

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
      throw new Error('Driver ID not found in the current context.');
    }

    const moveInfo = await this.moveRepository.findByMoveInfoId(moveInfoId);
    if (!moveInfo) {
      throw new Error(`MoveInfo with ID ${moveInfoId} not found.`);
    }

    // 드라이버가 이미 견적을 제출했을까?
    const existingEstimation = moveInfo.estimations.some(estimate => estimate.driverId === driverId);
    if (existingEstimation) {
      throw new EstimateAlreadyExistsException();
    }

    // 지정 요청이 있는지 확인
    const isDesignatedRequest = moveInfo.requests.some(request => request.driverId === driverId);

    if (isDesignatedRequest) {
      return this.handleDesignatedRequest(moveInfo, estimationData, reject, driverId);
    } else {
      // 일반 견적 생성
      return this.handleGeneralEstimation(moveInfo, estimationData, driverId);
    }
  }

  // 지정 요청 견적 생성
  private async handleDesignatedRequest(
    moveInfo: IMoveInfo,
    estimationData: EstimationInputDTO,
    reject: boolean,
    driverId: string,
  ): Promise<Estimation | { message: string }> {
    const pendingRequest = moveInfo.requests.find(request => request.status === 'PENDING' && request.driverId === driverId);

    if (!pendingRequest) {
      throw new Error('No pending request found for this driver.');
    }

    if (reject) {
      // 반려할 경우: REJECTED 로 상태 변경
      await this.requestRepository.update(pendingRequest.id, { status: 'REJECTED' });
      throw new RequestRejectedException();
    } else {
      // 승인할 경우: APPLY 로 상태 변경
      await this.requestRepository.update(pendingRequest.id, { status: 'APPLY' });
    }

    // 견적 생성
    const data = {
      ...estimationData,
      moveInfoId: moveInfo.id,
      driverId: driverId,
    };
    return this.estimationRepository.create(data);
  }

  // 일반 견적 생성
  private async handleGeneralEstimation(
    moveInfo: any,
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

//   // 견적 생성
//   async createEstimation(
//     moveInfoId: string,
//     estimationData: EstimationInputDTO,
//     reject: boolean = false,
//   ): Promise<Estimation | { message: string }> {
//     const { driverId } = this.als.getStore();
//     if (!driverId) {
//       throw new Error('Driver ID not found in the current context.');
//     }

//     const moveInfo = await this.moveRepository.findByMoveInfoId(moveInfoId);
//     if (!moveInfo) {
//       throw new Error(`MoveInfo with ID ${moveInfoId} not found.`);
//     }

//     // 드라이버가 이미 견적을 제출했을까 ?
//     const existingEstimation = moveInfo.estimations.some(estimate => estimate.driverId === driverId);
//     if (existingEstimation) {
//       throw new EstimateAlreadyExistsException();
//     }

//     //  지정 요청인지 확인하기
//     const isDesignatedRequest = moveInfo.requests.some(request => request.driverId === driverId);

//     if (isDesignatedRequest) {
//       const existingEstimation = moveInfo.estimations.find(estimate => estimate.driverId === driverId);
//       if (existingEstimation) {
//         throw new EstimateAlreadyExistsException();
//       }
//       //    moveinfo에 requests 배열에서 pending 상태 + driverid 찾기
//       const pendingRequest = moveInfo.requests.find(request => request.status === 'PENDING' && request.driverId === driverId);
//       if (pendingRequest) {
//         if (reject) {
//
//           //    지정 요청 반려하기 코멘트만 갈 수 있게 가격은 x
//           //    경우의 수랑 예외처리를....
//           await this.requestRepository.update(pendingRequest.id, { status: 'REJECTED' });
//           throw new RequestRejectedException();
//         } else {
//           //     지정 요청 승인하기
//           await this.requestRepository.update(pendingRequest.id, { status: 'APPLY' });
//           //    지정요청 견적 생성하기
//           const data = {
//             ...estimationData,
//             moveInfoId: moveInfo.id,
//             driverId: driverId,
//           };
//           return this.estimationRepository.create(data);
//         }
//       } else {
//         //    일반 이사 요청 처리
//         const data = {
//           ...estimationData,
//           moveInfoId: moveInfo.id,
//           driverId: driverId,
//         };

//         return this.estimationRepository.create(data);
//       }
//     }
//   }
// } 잠깐 주석처리하기

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

// return await this.estimationRepository.create(data);

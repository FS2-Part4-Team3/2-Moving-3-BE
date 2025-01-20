import { IEstimationService } from '#estimations/interfaces/estimation.service.interface.js';
import { EstimationRepository } from '#estimations/estimation.repository.js';
import { EstimationInputDTO, Estimation } from '#estimations/estimation.types.js';
import { Injectable } from '@nestjs/common';
import { IStorage } from '#types/common.types.js';
import { AsyncLocalStorage } from 'async_hooks';
import { MoveRepository } from '#move/move.repository.js';
import { RequestRepository } from '#requests/request.repository.js';
import { Progress, RequestStatus } from '#move/types/move.types.js';

@Injectable()
export class EstimationService implements IEstimationService {
  constructor(
    private readonly estimationRepository: EstimationRepository,
    private readonly moveRepository: MoveRepository,
    private readonly requestRepository: RequestRepository,
    private readonly als: AsyncLocalStorage<IStorage>,
  ) {}

  //견적 생성
  async createEstimation(moveInfoId: string, data: EstimationInputDTO): Promise<Estimation> {
    /**
     * moveInfoId: 이사 정보 ID - 고객의 요청 정보
     * driverId: 운전자(기사: 이삿짐 센터 직원)의 ID
     * comment: driver
     */

    const moveInfo = await this.moveRepository.findByMoveInfoId(moveInfoId);
    if (moveInfo.progress === Progress.OPEN) {
      // 일반요청
      return this.estimationRepository.create(data);
      // early return pattern -> google search go
    }

    // 지정요청 PENDING
    let afterRequestStatus = RequestStatus.APPLY;
    if (data.isRejected) {
      // 반려
      afterRequestStatus = RequestStatus.REJECTED;
    }

    console.log(moveInfo.requests);

    // TODO: transaction
    const pendingRequest = moveInfo.requests.find(request => request.status === RequestStatus.PENDING);

    await this.requestRepository.update(pendingRequest.id, { status: afterRequestStatus });

    return await this.estimationRepository.create(data);
  }
}

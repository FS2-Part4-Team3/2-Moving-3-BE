import { IEstimationService } from '#estimations/interfaces/estimation.service.interface.js';
import { EstimationRepository } from '#estimations/estimation.repository.js';
import {
  EstimationInputDTO,
  Estimation,
  ReviewableListDTO,
  UserEstimationListWithCountDTO,
} from '#estimations/estimation.types.js';
import { Injectable, Options } from '@nestjs/common';
import { IStorage } from '#types/common.types.js';
import { AsyncLocalStorage } from 'async_hooks';
import { MoveRepository } from '#move/move.repository.js';
import { RequestRepository } from '#requests/request.repository.js';
import { IMoveInfo } from '#move/types/move.types.js';
import { EstimateAlreadyExistsException, MoveRequestNotFoundException } from './estimation.exception.js';
import { RequestRejectedException } from './estimation.exception.js';
import { DriverNotFoundException } from '#drivers/driver.exception.js';
import { MoveInfoNotFoundException } from '#move/move.exception.js';
import { DriverService } from '#drivers/driver.service.js';
import { UnauthorizedException } from '#exceptions/http.exception.js';
import { IsActivate, OffsetPaginationOptions } from '#types/options.type.js';
import { ReviewableGetQueries } from '#types/queries.type.js';

@Injectable()
export class EstimationService implements IEstimationService {
  constructor(
    private readonly estimationRepository: EstimationRepository,
    private readonly moveRepository: MoveRepository,
    private readonly requestRepository: RequestRepository,
    private readonly als: AsyncLocalStorage<IStorage>,
    private readonly driversService: DriverService,
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

    // 지정 요청이 있는지 확인
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

  // 견적 목록 조회
  async getUserEstimationList(options: OffsetPaginationOptions): Promise<UserEstimationListWithCountDTO> {
    const { userId } = this.als.getStore(); // 유저 ID 가져오기
    if (!userId) {
      throw new UnauthorizedException();
    }
    const { page, pageSize } = options;

    const { estimations: generalEstimations, totalCount: generalTotalCount } =
      await this.estimationRepository.findEstimationsByUserId(userId, page, pageSize);
    if (generalEstimations.length === 0) {
      throw new MoveRequestNotFoundException();
    }

    const { estimations: specificEstimations, totalCount: specificTotalCount } =
      await this.estimationRepository.findSpecificEstimations(userId, page, pageSize);

    const specificEstimationsWithInfo = await Promise.all(
      specificEstimations.map(async estimation => {
        const driver = await this.driversService.findDriver(estimation.driverId);
        const isLiked = await this.driversService.isLikedDriver(estimation.driverId);
        const moveInfo = await this.moveRepository.findByMoveInfoId(estimation.moveInfoId);

        return {
          driver: {
            image: driver.image,
            name: driver.name,
            rating: driver.rating,
            reviewCount: driver.reviewCount,
            career: driver.career,
            applyCount: driver.applyCount,
            likedUsers: isLiked,
            likeCount: driver.likeCount,
          },
          moveInfo: {
            date: moveInfo?.date ?? null,
            serviceType: moveInfo?.serviceType,
            fromAddress: moveInfo.fromAddress,
            toAddress: moveInfo.toAddress,
          },
          estimationInfo: {
            estimationId: estimation.id,
            price: estimation.price ?? null,
          },
          designatedRequest: IsActivate.Active, //지정견적
        };
      }),
    );

    //일반 견적
    const generalEstimationsWithInfo = await Promise.all(
      generalEstimations.map(async estimation => {
        const driver = await this.driversService.findDriver(estimation.driverId);
        const isLiked = await this.driversService.isLikedDriver(estimation.driverId);
        const moveInfo = await this.moveRepository.findByMoveInfoId(estimation.moveInfoId);

        return {
          driver: {
            image: driver.image,
            name: driver.name,
            rating: driver.rating,
            reviewCount: driver.reviewCount,
            career: driver.career,
            applyCount: driver.applyCount,
            likedUsers: isLiked,
            likeCount: driver.likeCount,
          },
          moveInfo: {
            date: moveInfo?.date ?? null,
            serviceType: moveInfo?.serviceType,
            fromAddress: moveInfo.fromAddress,
            toAddress: moveInfo.toAddress,
          },
          estimationInfo: {
            estimationId: estimation.id,
            price: estimation.price ?? null,
          },
          designatedRequest: IsActivate.Inactive, //일반견적
        };
      }),
    );
    const totalCount = generalTotalCount + specificTotalCount;

    return {
      estimations: [...generalEstimationsWithInfo, ...specificEstimationsWithInfo],
      totalCount,
    };
  }

  // 작성 가능한 리뷰 목록 조회
  async getReviewableEstimations(
    options: ReviewableGetQueries,
  ): Promise<{ estimations: ReviewableListDTO[]; totalCount: number }> {
    const { userId } = this.als.getStore(); // 유저 ID 가져오기
    if (!userId) {
      throw new UnauthorizedException(); // 유저 ID가 없을 경우 예외 처리
    }

    const { page, pageSize } = options;
    const moveInfos = await this.estimationRepository.getUserMoveInfos(userId);

    if (moveInfos.length === 0) {
      throw new MoveInfoNotFoundException(); // 이사 정보가 없을 경우 예외 처리
    }

    const moveInfoIds = moveInfos.map(info => info.id);

    const estimations = await this.estimationRepository.findReviewableEstimations(userId, moveInfoIds, page, pageSize);
    const totalCount = await this.estimationRepository.findTotalCount(moveInfoIds);

    const result = await Promise.all(
      estimations.map(async estimation => {
        const driver = await this.driversService.findDriver(estimation.driverId);
        const moveInfo = await this.moveRepository.findByMoveInfoId(estimation.moveInfoId);
        //지정요청 여부 확인하기
        const designatedRequest = await this.estimationRepository.isDesignatedRequest(estimation.id);

        return {
          driver: {
            image: driver.image || null,
            name: driver.name,
          },
          moveInfo: {
            date: moveInfo.date,
            serviceType: moveInfo.serviceType,
          },
          estimationInfo: {
            estimationId: estimation.id,
            price: estimation.price,
          },
          designatedRequest, // 지정견적요청유무 추가
        };
      }),
    );
    return { estimations: result, totalCount };
  }

  // 견적 상세 조회 - 유저
  async getUserEstimationDetail(estimationId: string) {
    const { userId } = this.als.getStore(); // 유저 ID 가져오기
    if (!userId) {
      throw new UnauthorizedException();
    }

    const estimation = await this.estimationRepository.findEstimationDetail(estimationId, userId);
    if (!estimation) {
      // throw new NotFoundException('견적을 찾을 수 없습니다.');
    }
  }
}

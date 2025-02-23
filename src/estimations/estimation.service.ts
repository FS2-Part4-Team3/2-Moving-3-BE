import { IEstimationService } from '#estimations/interfaces/estimation.service.interface.js';
import { EstimationRepository } from '#estimations/estimation.repository.js';
import { Injectable } from '@nestjs/common';
import { IStorage } from '#types/common.types.js';
import { AsyncLocalStorage } from 'async_hooks';
import { MoveRepository } from '#move/move.repository.js';
import { RequestRepository } from '#requests/request.repository.js';
import { IMoveInfo } from '#move/types/move.types.js';
import { EstimateAlreadyExistsException, EstimationAccessForbiddenException } from './estimation.exception.js';
import { DriverNotFoundException } from '#drivers/driver.exception.js';
import { MoveInfoNotFoundException } from '#move/move.exception.js';
import { DriverService } from '#drivers/driver.service.js';
import { UnauthorizedException } from '#exceptions/http.exception.js';
import {
  DriverEstimationsGetQueries,
  DriverRejectedEstimations,
  EstimationGetQueries,
  ReviewableGetQueries,
} from '#types/queries.type.js';
import {
  ConfirmedEstimationDTO,
  DriverEstimationDetailDTO,
  DriverEstimationsListDTO,
  EstimationInputDTO,
  RejectedEstimationsListDTO,
  ReviewableListDTO,
  UserEstimationDetailDTO,
  UserEstimationListWithCountDTO,
} from './types/estimation.dto.js';
import { Estimation } from './types/estimation.types.js';
import { IsActivate } from '#types/options.type.js';

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

  // 대기중 견적 목록 조회 수정
  async getUserEstimationList(options: EstimationGetQueries): Promise<UserEstimationListWithCountDTO> {
    const { userId } = this.als.getStore();
    if (!userId) throw new UnauthorizedException();

    const { page, pageSize } = options;
    const totalCount = await this.estimationRepository.getTotalCountForUser(userId);

    // 받은 견적이 없으면 예외 처리
    if (totalCount === 0) {
      return { estimations: [], totalCount: 0 };
    }

    const estimations = await this.estimationRepository.findUserEstimations(userId, page, pageSize);

    const estimationsWithInfo = await Promise.all(
      estimations.map(async estimation => {
        const driver = await this.driversService.findDriver(estimation.driverId);
        const isLiked = await this.driversService.isLikedDriver(estimation.driverId);
        const moveInfo = await this.moveRepository.findByMoveInfoId(estimation.moveInfoId);

        const designatedRequest = await this.requestRepository.DesignatedRequest(estimation.moveInfoId, estimation.driverId);

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
            moveInfoId: estimation.moveInfoId,
            date: moveInfo?.date ?? null,
            serviceType: moveInfo?.serviceType,
            fromAddress: moveInfo.fromAddress,
            toAddress: moveInfo.toAddress,
          },
          estimationInfo: {
            estimationId: estimation.id,
            price: estimation.price ?? null,
          },
          designatedRequest: designatedRequest ? IsActivate.Active : IsActivate.Inactive, // //'Active': 지정 요청 견적, 'Inactive': 일반 견적
        };
      }),
    );

    return { estimations: estimationsWithInfo, totalCount };
  }

  // 작성 가능한 리뷰 목록 조회
  async getReviewableEstimations(
    options: ReviewableGetQueries,
  ): Promise<{ estimations: ReviewableListDTO[]; totalCount: number }> {
    const { userId } = this.als.getStore();
    if (!userId) {
      throw new UnauthorizedException();
    }

    const { page, pageSize } = options;
    const moveInfos = await this.moveRepository.getUserMoveInfo(userId);

    if (moveInfos.length === 0) {
      throw new MoveInfoNotFoundException();
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
            createdAt: estimation.createdAt,
            updatedAt: estimation.updatedAt,
          },
          designatedRequest,
        };
      }),
    );
    return { estimations: result, totalCount };
  }

  // 드라이버 - 보낸 견적 조회(드라이버가 승인한 견적)
  async getDriverEstimations(
    options: DriverEstimationsGetQueries,
  ): Promise<{ estimations: DriverEstimationsListDTO[]; totalCount: number }> {
    const { driverId } = this.als.getStore();
    if (!driverId) {
      throw new UnauthorizedException();
    }

    const { page, pageSize } = options;
    const estimations = await this.estimationRepository.findEstimationsByDriverId(driverId, page, pageSize);
    const totalCount = await this.estimationRepository.countEstimationsByDriverId(driverId);

    const estimationData = await Promise.all(
      estimations.map(async estimation => {
        const designatedRequest = await this.estimationRepository.isDesignatedRequestForDriver(estimation.id, driverId);

        return {
          estimationInfo: {
            estimationId: estimation.id,
            price: estimation.price,
            createdAt: estimation.createdAt,
            updatedAt: estimation.updatedAt,
          },
          moveInfo: {
            moveInfoId: estimation.moveInfoId,
            date: estimation.moveInfo.date,
            serviceType: estimation.moveInfo.serviceType,
            fromAddress: estimation.moveInfo.fromAddress,
            toAddress: estimation.moveInfo.toAddress,
          },
          user: {
            name: estimation.moveInfo.owner.name,
          },
          designatedRequest: designatedRequest,
          progress: estimation.moveInfo.progress,
        };
      }),
    );

    return { estimations: estimationData, totalCount };
  }

  // 견적 상세 조회 - 유저
  async getUserEstimationDetail(estimationId: string): Promise<UserEstimationDetailDTO> {
    const { userId } = this.als.getStore();
    if (!userId) {
      throw new UnauthorizedException();
    }

    const estimation = await this.estimationRepository.findEstimationDetail(estimationId);
    const driver = await this.driversService.findDriver(estimation.driverId);
    const designatedRequest = await this.requestRepository.findDesignatedStatus(estimation.moveInfoId, estimation.driverId);

    return {
      driverId: driver.id,
      moveInfo: {
        moveInfoId: estimation.moveInfoId,
        createdAt: estimation.moveInfo.createdAt,
        date: estimation.moveInfo?.date ?? null,
        serviceType: estimation.moveInfo?.serviceType,
        fromAddress: estimation.moveInfo.fromAddress,
        toAddress: estimation.moveInfo.toAddress,
        progress: estimation.moveInfo.progress,
      },
      estimationInfo: {
        comment: estimation.comment,
        id: estimation.id,
        price: estimation.price,
      },
      designatedRequest,
    };
  }

  // 견적 상세 조회 - 드라이버
  async getDriverEstimationDetail(estimationId: string): Promise<DriverEstimationDetailDTO> {
    const { driverId } = this.als.getStore();
    if (!driverId) {
      throw new UnauthorizedException();
    }
    const estimation = await this.estimationRepository.findEstimationDriverDetail(estimationId);

    if (estimation.driverId !== driverId) {
      throw new EstimationAccessForbiddenException();
    }

    const designatedRequest = await this.requestRepository.findDesignatedStatus(estimation.moveInfoId, estimation.driverId);

    return {
      user: {
        name: estimation.moveInfo.owner.name,
      },
      estimationInfo: {
        estimationId: estimation.id,
        price: estimation.price,
        createdAt: estimation.createdAt,
        updatedAt: estimation.updatedAt,
      },
      moveInfo: {
        createdAt: estimation.moveInfo.createdAt,
        date: estimation.moveInfo.date,
        serviceType: estimation.moveInfo.serviceType,
        fromAddress: estimation.moveInfo.fromAddress,
        toAddress: estimation.moveInfo.toAddress,
        progress: estimation.moveInfo.progress,
      },
      designatedRequest,
    };
  }
  // 드라이버 반려 견적 조회
  async getRejectedEstimations(
    options: DriverRejectedEstimations,
  ): Promise<{ estimations: RejectedEstimationsListDTO[]; totalCount: number }> {
    const { driverId } = this.als.getStore();
    if (!driverId) {
      throw new UnauthorizedException();
    }

    const { page, pageSize } = options;

    const estimations = await this.estimationRepository.findRejectedEstimationsByDriverId(driverId, page, pageSize);

    if (!estimations || estimations.length === 0) {
      return { estimations: [], totalCount: 0 };
    }

    const totalCount = await this.estimationRepository.countRejectedEstimationsByDriverId(driverId);

    const estimationData = estimations.map(estimation => ({
      moveInfo: {
        date: estimation.moveInfo.date,
        serviceType: estimation.moveInfo.serviceType,
        fromAddress: estimation.moveInfo.fromAddress,
        toAddress: estimation.moveInfo.toAddress,
        createdAt: estimation.moveInfo.createdAt,
      },
      user: {
        name: estimation.moveInfo.owner.name,
      },
      estimationInfo: {
        estimationId: estimation.id,
      },
    }));

    return { estimations: estimationData, totalCount };
  }

  async getConfirmedEstimation(estimationId: string): Promise<ConfirmedEstimationDTO> {
    const { reviews, ...estimation } = await this.estimationRepository.findById(estimationId);

    const driver = await this.driversService.findDriver(estimation.driverId);
    const isLiked = await this.driversService.isLikedDriver(estimation.driverId);
    const designatedRequest = await this.requestRepository.findDesignatedStatus(estimation.moveInfoId, estimation.driverId);
    const isSpecificRequest = designatedRequest === IsActivate.Active ? true : false;

    const ConfirmedEstimationInfo = {
      comment: estimation.comment,
      price: estimation.price,

      driver: {
        driverId: driver.id,
        image: driver.image,
        name: driver.name,
        rating: driver.rating,
        reviewCount: driver.reviewCount,
        career: driver.career,
        applyCount: driver.applyCount,
        isliked: isLiked,
        likeCount: driver.likeCount,
        serviceType: driver.serviceType,
      },
      isSpecificRequest,
    };
    return ConfirmedEstimationInfo;
  }
}

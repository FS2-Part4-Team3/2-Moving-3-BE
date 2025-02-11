import { EstimationInputDTO, Estimation, IsActivate, UserEstimationDetailDTO } from '#estimations/estimation.types.js';
import { IEstimationRepository } from '#estimations/interfaces/estimation.repository.interface.js';
import { PrismaService } from '#global/prisma.service.js';
import { FindOptions, SortOrder } from '#types/options.type.js';
import { Injectable } from '@nestjs/common';
import { Progress, Status } from '@prisma/client';

@Injectable()
export class EstimationRepository implements IEstimationRepository {
  private readonly estimation;
  constructor(private readonly prisma: PrismaService) {
    this.estimation = prisma.estimation;
  }

  async findMany(options: FindOptions) {}

  async findById(id: string) {
    const estimation = await this.estimation.findUnique({ where: { id }, include: { reviews: true } });

    return estimation;
  }

  async create(data: EstimationInputDTO): Promise<Estimation> {
    return this.estimation.create({
      data: {
        moveInfoId: data.moveInfoId, //이사정보아이디
        driverId: data.driverId, //드라이버아이디
        price: data.price ?? null, //견적가격(없으면 null로 처리하기)
        comment: data.comment, //견적코멘트
      },
    });
  }

  // 대기중 지정 여부
  async isSpecificEstimation(moveInfoId: string): Promise<boolean> {
    const count = await this.prisma.request.count({
      where: {
        moveInfoId: moveInfoId,
        status: Status.PENDING, // 지정 요청이 있는지 확인
      },
    });
    return count > 0;
  }

  // 대기중 견적 조회
  async findUserEstimations(
    userId: string,
    page: number,
    pageSize: number,
  ): Promise<{ estimations: Estimation[]; totalCount: number }> {
    const moveInfos = await this.prisma.moveInfo.findMany({
      where: { ownerId: userId },
      select: { id: true },
    });

    const moveInfoIds = moveInfos.map(info => info.id);

    const totalCount = await this.prisma.estimation.count({
      where: {
        moveInfoId: { in: moveInfoIds },
        OR: [
          {
            moveInfo: {
              progress: Progress.OPEN,
              requests: { none: {} },
            },
          },
          {
            moveInfo: {
              requests: {
                some: { status: Status.PENDING },
              },
            },
          },
        ],
      },
    });

    const estimations = await this.prisma.estimation.findMany({
      where: {
        moveInfoId: { in: moveInfoIds },
        OR: [
          {
            moveInfo: {
              progress: Progress.OPEN,
              requests: { none: {} },
            },
          },
          {
            moveInfo: {
              requests: {
                some: { status: Status.PENDING },
              },
            },
          },
        ],
      },
      include: {
        driver: true,
        moveInfo: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
      skip: (page - 1) * pageSize,
      take: pageSize,
    });

    return { estimations, totalCount };
  }

  // 리뷰 가능한 견적 목록 토탈 카운트
  async findTotalCount(moveInfoIds: string[]): Promise<number> {
    return this.prisma.estimation.count({
      where: {
        confirmedForId: { in: moveInfoIds },
      },
    });
  }

  // 리뷰 가능한 견적 목록
  async findReviewableEstimations(userId: string, moveInfoIds: string[], page: number, pageSize: number) {
    const estimations = await this.prisma.estimation.findMany({
      where: {
        confirmedForId: { in: moveInfoIds },
      },
      include: {
        driver: true,
        moveInfo: true,
        reviews: true,
      },
      skip: (page - 1) * pageSize,
      take: pageSize,
    });

    // 리뷰가 없는 견적만 필터링
    return estimations.filter(estimation => !estimation.reviews.some(review => review.ownerId === userId));
  }

  // 유저의 이사 정보 목록 가져오기
  async getUserMoveInfos(userId: string) {
    return this.prisma.moveInfo.findMany({
      where: { ownerId: userId }, // 로그인한 유저의 이사만 조회하기
      select: { id: true }, // 이사 ID만 선택
    });
  }

  // 지정 견적 요청 여부
  async isDesignatedRequest(estimationId: string): Promise<IsActivate> {
    const estimation = await this.prisma.estimation.findUnique({
      where: { id: estimationId },
      include: {
        moveInfo: {
          include: {
            requests: {
              where: {
                status: 'APPLY', //
              },
            },
          },
        },
      },
    });

    // 지정요청이면 'Active', 일반요청이면 'Inactive'
    return estimation?.moveInfo.requests.length > 0 ? IsActivate.Active : IsActivate.Inactive;
  }

  // 지정 견적 요청 여부 (상태 제외)
  async isDesignatedRequestDriver(estimationId: string): Promise<IsActivate> {
    const estimation = await this.prisma.estimation.findUnique({
      where: { id: estimationId },
      include: {
        moveInfo: {
          include: {
            requests: {
              where: {
                driverId: { not: null }, // 지정 요청을 받은 드라이버 ID가 있어야 함
              },
            },
          },
        },
      },
    });

    // 지정요청이 있으면 'Active', 없으면 'Inactive'
    return estimation?.moveInfo.requests.some(request => request.driverId) ? IsActivate.Active : IsActivate.Inactive;
  }

  // 드라이버 토탈카운트
  async countByDriverId(driverId: string): Promise<number> {
    return this.estimation.count({
      where: {
        driverId,
        price: { not: null },
      },
    });
  }

  // 견적확정하기 - 견적 조회 (특정 이사 정보 ID와 견적 ID로 조회
  async findEstimationByMoveInfo(moveInfoId: string, estimationId: string) {
    return this.estimation.findUnique({
      where: { id: estimationId, moveInfoId },
    });
  }

  async confirmedForIdEstimation(estimationId: string, moveInfoId: string) {
    return this.estimation.update({
      where: { id: estimationId },
      data: { confirmedForId: moveInfoId },
    });
  }

  async findEstimationsByDriverId(driverId: string, page: number, pageSize: number) {
    // 1. 진행 중인 상태 조회 (OPEN, CONFIRMED)
    const inProgressEstimations = await this.estimation.findMany({
      where: {
        driverId,
        moveInfo: { progress: { in: ['OPEN', 'CONFIRMED'] } },
      },
      include: { moveInfo: { include: { owner: true } } },
      orderBy: { createdAt: 'desc' }, // 최신순 정렬
    });

    // 2. 완료된 상태 조회 (COMPLETE, EXPIRED, CANCELED)
    const completedEstimations = await this.estimation.findMany({
      where: {
        driverId,
        moveInfo: { progress: { in: ['COMPLETE', 'EXPIRED', 'CANCELED'] } },
      },
      include: { moveInfo: { include: { owner: true } } },
      orderBy: { createdAt: 'desc' }, // 최신순 정렬
    });

    // 3. 진행 중 → 완료 순서 유지 후, createdAt 기준 재정렬
    const sortedResults = [...inProgressEstimations, ...completedEstimations].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );

    // 4. 페이지네이션 적용
    return sortedResults.slice((page - 1) * pageSize, page * pageSize);
  }

  //드라이버가 보낸 견적조회 토탈카운트
  async countEstimationsByDriverId(driverId: string): Promise<number> {
    return this.estimation.count({
      where: {
        driverId,
        moveInfo: { progress: { in: ['OPEN', 'CONFIRMED', 'COMPLETE', 'EXPIRED', 'CANCELED'] } },
      },
    });
  }

  async isDesignatedRequestForDriver(estimationId: string, driverId: string): Promise<IsActivate> {
    const estimation = await this.prisma.estimation.findUnique({
      where: { id: estimationId },
      include: {
        moveInfo: {
          include: {
            requests: {
              where: {
                driverId: driverId, // 로그인한 드라이버의 ID로 필터링
              },
            },
          },
        },
      },
    });

    // 지정요청이면 'Active', 일반요청이면 'Inactive'
    return estimation?.moveInfo.requests.length > 0 ? IsActivate.Active : IsActivate.Inactive;
  }

  // 유저 견적 상세조회
  async findEstimationDetail(estimationId: string) {
    return await this.estimation.findUnique({
      where: { id: estimationId },
      select: {
        id: true,
        price: true,
        comment: true,
        createdAt: true,
        driverId: true,
        moveInfo: {
          select: {
            date: true,
            serviceType: true,
            fromAddress: true,
            toAddress: true,
            progress: true,
          },
        },
      },
    });
  }

  // 유저 견적 상세 조회 지정요청 여부
  async findDesignatedStatus(moveInfoId: string, driverId: string): Promise<IsActivate> {
    const request = await this.prisma.request.findFirst({
      where: {
        moveInfoId,
        driverId,
      },
    });

    return request ? IsActivate.Active : IsActivate.Inactive;
  }

  // 드라이버 견적 상세 조회
  async findEstimationDriverDetail(estimationId: string) {
    return this.prisma.estimation.findUnique({
      where: { id: estimationId },
      include: {
        moveInfo: {
          include: {
            owner: true,
          },
        },
      },
    });
  }

  // 드라이버 반려 견적 조회
  async findRejectedEstimationsByDriverId(driverId: string, page: number, pageSize: number) {
    return this.estimation.findMany({
      where: {
        driverId,
        price: null, // price가 없는게 → 반려된 견적
      },
      include: { moveInfo: { include: { owner: true } } },
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * pageSize,
      take: pageSize,
    });
  }

  // 드라이버 반려 견적 토탈 카운트
  async countRejectedEstimationsByDriverId(driverId: string): Promise<number> {
    return this.estimation.count({
      where: {
        driverId,
        price: null,
      },
    });
  }
}

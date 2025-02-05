import { EstimationInputDTO, Estimation, IsActivate } from '#estimations/estimation.types.js';
import { IEstimationRepository } from '#estimations/interfaces/estimation.repository.interface.js';
import { PrismaService } from '#global/prisma.service.js';
import { FindOptions } from '#types/options.type.js';
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

  async findEstimationsByUserId(
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
        moveInfo: {
          progress: Progress.OPEN,
          requests: {
            none: {},
          },
        },
      },
    });

    // 일반 견적 조회
    const estimations = await this.prisma.estimation.findMany({
      where: {
        moveInfoId: { in: moveInfoIds },
        moveInfo: {
          progress: Progress.OPEN,
          requests: {
            none: {},
          },
        },
      },
      include: {
        driver: true,
        moveInfo: true,
      },
      skip: (page - 1) * pageSize,
      take: pageSize,
    });
    return { estimations, totalCount };
  }

  async findSpecificEstimations(
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
        moveInfo: {
          requests: {
            some: {
              status: Status.PENDING,
            },
          },
        },
      },
    });

    // 지정 견적 조회
    const estimations = await this.prisma.estimation.findMany({
      where: {
        moveInfoId: { in: moveInfoIds },
        moveInfo: {
          requests: {
            some: {
              status: Status.PENDING,
            },
          },
        },
      },
      include: {
        driver: true,
        moveInfo: {
          include: {
            requests: true,
          },
        },
      },
      skip: (page - 1) * pageSize,
      take: pageSize,
    });
    return { estimations, totalCount };
  }

  // 토탈카운트
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

  // 견적확정하기 - 견적 조회 (특정 이사 정보 ID와 견적 ID로 조회
  async findEstimationByMoveInfo(moveInfoId: string, estimationId: string) {
    return this.estimation.findUnique({
      where: { id: estimationId, moveInfoId },
    });
  }

  // findFirst 가 맞을까 아니면 findUnique(아이디는 고유한 값이니까 유니크가 좀 더 명확하다),,??

  async confirmedForIdEstimation(estimationId: string, moveInfoId: string) {
    return this.estimation.update({
      where: { id: estimationId },
      data: { confirmedForId: moveInfoId },
    });
  }

  // async confirmedForIdEstimation(estimationId: string, moveInfoId: string) {
  //     // return this.estimation.update({
  //     where: { id: estimationId },
  //     data: { confirmedForId: moveInfoId },
  //   });
  // }
}

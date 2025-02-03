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

  async findEstimationsByUserId(userId: string, page: number, pageSize: number): Promise<Estimation[]> {
    const moveInfos = await this.prisma.moveInfo.findMany({
      where: { ownerId: userId },
      select: { id: true },
    });

    const moveInfoIds = moveInfos.map(info => info.id);
    // 일반 견적 조회
    return this.prisma.estimation.findMany({
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
  }

  async findSpecificEstimations(userId: string, page: number, pageSize: number): Promise<Estimation[]> {
    const moveInfos = await this.prisma.moveInfo.findMany({
      where: { ownerId: userId },
      select: { id: true },
    });
    const moveInfoIds = moveInfos.map(info => info.id);
    // 지정 견적 조회
    return this.prisma.estimation.findMany({
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
  }

  // confirmedForId 값이 null이 아니면은 이사확정 끝난것이다..~!
  async findReviewable(userId: string, moveInfoIds: string[], page: number, pageSize: number) {
    const estimations = await this.prisma.estimation.findMany({
      where: {
        confirmedForId: { in: moveInfoIds }, // 완료된 이사와 연결된 견적을 조회
      },
      include: {
        driver: true, // 견적과 관련된 드라이버 정보
        moveInfo: true, // 견적과 관련된 이사 정보
        reviews: true, // 견적에 작성된 리뷰들
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
}

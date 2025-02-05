import { EstimationInputDTO, Estimation, IsActivate } from '#estimations/estimation.types.js';
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

  //드라이버가 보낸 견적 조회
  async findSentEstimations(driverId: string, moveInfoIds: string[], page: number, pageSize: number, orderBy: SortOrder) {
    return this.estimation.findMany({
      where: {
        driverId,
        moveInfoId: { in: moveInfoIds },
        moveInfo: {
          requests: {
            some: {
              driverId, //리퀘스트 안에 드라이버 아이디가 있으면 지정요청을 받은거
            },
          },
        },
      },
      include: {
        moveInfo: {
          include: {
            requests: true,
          },
        },
      },
      skip: (page - 1) * pageSize,
      take: pageSize,
      orderBy: {
        createdAt: orderBy === SortOrder.Oldest ? 'asc' : 'desc', // 정렬
      },
    });
  }

  // 자기가 보낸 견적..반려한거 제외하기..?
  async findSentDriverEstimations(driverId: string, page: number, pageSize: number, orderBy: SortOrder) {
    return this.estimation.findMany({
      where: {
        driverId, //드라이버가 일치하는 견적만 조회하기
        price: { not: null }, // 가격이 없는 견적은 제외하기 (반려하면 가격을 안적으니까)
      },
      skip: (page - 1) * pageSize,
      take: pageSize,
      orderBy: {
        createdAt: orderBy === SortOrder.Oldest ? 'asc' : 'desc',
        // 정렬  진행중 견적이 맨위고 (걔네를 최신순으로 정렬을 하고) / 이사 견적 더못보내는 견적끼리 (최신순으로 정렬)
        // 프로그레스 상태에 따라 정렬을..?
      },
    });
  }

  //만료된 상태보내주기..? 효빈-> 이사가 진행중인지 아닌지만, 견적이 막혀있나 안막혀있나로 하기

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
        price: { not: null }, // 가격이 없는 견적 제외
      },
    });
  }
}

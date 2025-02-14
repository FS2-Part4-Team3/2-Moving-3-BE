import { PrismaService } from '#global/prisma.service.js';
import { IMoveRepository } from '#move/interfaces/move.repository.interface.js';
import { MoveInfo, MoveInfoInputDTO } from '#move/move.types.js';
import { MoveInfoSortOrder, OffsetPaginationOptions } from '#types/options.type.js';
import { MoveInfoGetQueries } from '#types/queries.type.js';
import { areaToKeyword } from '#utils/address-utils.js';
import { getDayEnd, getDayStart } from '#utils/dateUtils.js';
import { Injectable } from '@nestjs/common';
import { Area, Progress } from '@prisma/client';
import { IMoveInfo } from './types/move.types.js';

@Injectable()
export class MoveRepository implements IMoveRepository {
  private readonly moveInfo;
  constructor(private readonly prisma: PrismaService) {
    this.moveInfo = prisma.moveInfo;
  }

  async findManyByDate(date: Date) {
    const moveInfos = await this.moveInfo.findMany({
      where: {
        progress: Progress.CONFIRMED,
        date: {
          gte: getDayStart(date),
          lt: getDayEnd(date),
        },
      },
      include: {
        owner: true,
        confirmedEstimation: { include: { driver: true } },
      },
    });

    return moveInfos;
  }

  async findMany(options: MoveInfoGetQueries, driverId: string, whereCondition: any) {
    const { page = 1, pageSize = 10, orderBy } = options;

    let orderByCondition;
    if (orderBy === MoveInfoSortOrder.UpcomingMoveDate) {
      orderByCondition = { date: 'asc' };
    } else if (orderBy === MoveInfoSortOrder.RecentRequest) {
      orderByCondition = { createdAt: 'desc' };
    } else {
      orderByCondition = { createdAt: 'desc' };
    }

    const list = await this.moveInfo.findMany({
      where: whereCondition,
      skip: (page - 1) * pageSize,
      take: pageSize,
      orderBy: orderByCondition,
      include: {
        owner: { select: { name: true } },
        requests: { select: { driverId: true } },
      },
    });

    const addedList = list.map(moveInfo => ({
      ...moveInfo,
      isSpecificRequest: moveInfo.requests.some(req => req.driverId === driverId),
    }));

    return addedList;
  }

  async getTotalCount(whereCondition: any, isForceFind: boolean) {
    const totalCount = await this.moveInfo.count({ where: whereCondition, forceFind: isForceFind });

    return totalCount;
  }

  async getFilteringCounts(driverId: string, driverAvailableAreas: Area[]) {
    const serviceTypeCounts = await Promise.all(
      ['SMALL', 'HOME', 'OFFICE'].map(async type => ({
        type,
        count: await this.moveInfo.count({
          where: {
            serviceType: type,
            NOT: {
              estimations: {
                some: {
                  driverId: driverId,
                },
              },
            },
            progress: Progress.OPEN,
          },
        }),
      })),
    );

    const serviceAreaCount = await this.moveInfo.count({
      where: {
        OR: [
          ...driverAvailableAreas.map(area => ({
            fromAddress: { contains: areaToKeyword(area) },
          })),
          ...driverAvailableAreas.map(area => ({
            toAddress: { contains: areaToKeyword(area) },
          })),
        ],
        NOT: {
          estimations: {
            some: {
              driverId: driverId,
            },
          },
        },
        progress: Progress.OPEN,
      },
    });

    const designatedRequestCount = await this.moveInfo.count({
      where: {
        requests: {
          some: {
            driverId,
          },
        },
        NOT: {
          estimations: {
            some: {
              driverId: driverId,
            },
          },
        },
        progress: Progress.OPEN,
      },
    });

    return { serviceTypeCounts, serviceAreaCount, designatedRequestCount };
  }

  async findByUserId(userId: string) {
    const moveInfo = await this.moveInfo.findMany({
      where: { ownerId: userId, progress: Progress.OPEN },
      include: {
        requests: true,
      },
    });

    return moveInfo;
  }

  async findWithEstimationsByUserId(userId: string, paginationOptions: OffsetPaginationOptions) {
    const { page = 1, pageSize = 10 } = paginationOptions;

    const list = await this.moveInfo.findMany({
      where: { ownerId: userId, progress: { in: [Progress.CANCELED, Progress.COMPLETE] } },
      forceFind: true,
      skip: (page - 1) * pageSize,
      take: pageSize,
      include: { confirmedEstimation: true, estimations: true },
    });

    return list;
  }

  async findByMoveInfoId(moveInfoId: string) {
    const moveInfo = await this.moveInfo.findUnique({
      where: { id: moveInfoId },
      include: {
        requests: true,
        estimations: true,
      },
    });

    return moveInfo;
  }

  async postMoveInfo(moveData: MoveInfoInputDTO): Promise<MoveInfo> {
    return await this.moveInfo.create({ data: moveData });
  }

  async update(id: string, data: Partial<MoveInfoInputDTO>) {
    const moveInfo = await this.moveInfo.update({ where: { id }, data });

    return moveInfo;
  }

  async softDeleteMoveInfo(id: string) {
    const moveInfo = await this.moveInfo.delete({ where: { id } });

    return moveInfo;
  }

  async findMoveInfoById(moveInfoId: string): Promise<IMoveInfo | null> {
    const moveInfo = await this.moveInfo.findUnique({
      where: { id: moveInfoId },
    });

    return moveInfo;
  }

  // 확정된 견적이 있는지 확인하기 null이면 false 반환하고 있으면 true 반환하기
  async checkConfirmedEstimation(moveInfoId: string) {
    const moveInfo = await this.moveInfo.findUnique({
      where: { id: moveInfoId },
      select: { confirmedEstimationId: true },
    });

    return !!moveInfo?.confirmedEstimationId;
  }

  // 견적 확정하기 랑 이사 정보 상태 업데이트
  async confirmEstimation(moveInfoId: string, estimationId: string) {
    return this.moveInfo.update({
      where: { id: moveInfoId },
      data: {
        confirmedEstimationId: estimationId,
        progress: Progress.CONFIRMED, // 상태를 CONFIRMED로 업데이트
      },
    });
  }

  // MoveInfo의 상태를 업데이트하는 메서드
  // async updateMoveInfoProgress(currentStatus: string, newStatus: string, now: Date) {
  //   const result = await this.prisma.moveInfo.updateMany({
  //     where: {
  //       progress: Progress.CONFIRMED, // 현재 상태
  //       date: {
  //         lt: now, // 현재 시간보다 이전
  //       },
  //       confirmedEstimationId: currentStatus === 'CONFIRMED' ? { not: null } : undefined, // 상태가 'CONFIRMED'인 경우만
  //     },
  //     // data: {
  //     //   progress: newStatus, //Progress.COMPLETE,  // 완료됨상태
  //     // },
  //   });

  //   return result.count;
  // }

  // 'EXPIRED' 상태의 MoveInfo에 연결된 Request를 'EXPIRED'로 변경하기
  // async updateRequestsStatus() {
  //   const expiredMoveInfos = await this.prisma.moveInfo.findMany({
  //     where: { progress: 'EXPIRED' },
  //     select: { id: true },
  //   });

  //   const result = await this.prisma.request.updateMany({
  //     where: {
  //       moveInfoId: { in: expiredMoveInfos.map(move => move.id) },
  //     },
  //     data: {
  //       status: 'EXPIRED',
  //     },
  //   });

  //   return result.count;
  // }
  // //

  async updateToComplete(now: Date) {
    return this.prisma.moveInfo.updateMany({
      where: {
        progress: 'CONFIRMED',
        date: { lt: now },
        confirmedEstimationId: { not: null },
      },
      data: {
        progress: 'COMPLETE', // 'COMPLETE'로 변경
      },
    });
  }

  async updateToExpired(now: Date) {
    return this.prisma.moveInfo.updateMany({
      where: {
        progress: 'OPEN', // 'OPEN' 상태
        confirmedEstimationId: null,
        date: { lt: now },
      },
      data: {
        progress: 'EXPIRED', // 'EXPIRED'로 변경
      },
    });
  }

  async updateToRequestExpired() {
    return this.prisma.request.updateMany({
      where: {
        moveInfoId: {
          in: (
            await this.prisma.moveInfo.findMany({
              where: { progress: 'EXPIRED' },
              select: { id: true },
            })
          ).map(move => move.id), // EXPIRED 상태가 된 moveInfo ID 목록 추출
        },
      },
      data: { status: 'EXPIRED' },
    });
  }
}

import { PrismaService } from '#global/prisma.service.js';
import { IMoveRepository } from '#move/interfaces/move.repository.interface.js';
import { IMoveInfo } from '#move/types/move.types.js';
import { AreaType, ProgressEnum } from '#types/common.types.js';
import { MoveInfoSortOrder, OffsetPaginationOptions } from '#types/options.type.js';
import { MoveInfoGetQueries } from '#types/queries.type.js';
import { areaToKeyword } from '#utils/address-utils.js';
import { getDayEnd, getDayStart } from '#utils/dateUtils.js';
import { Injectable } from '@nestjs/common';
import { CreateMoveDTO, MovePatchInputDTO } from './types/move.dto.js';

@Injectable()
export class MoveRepository implements IMoveRepository {
  private readonly moveInfo;
  constructor(private readonly prisma: PrismaService) {
    this.moveInfo = prisma.moveInfo;
  }

  async findManyByDate(date: Date) {
    const moveInfos = await this.moveInfo.findMany({
      where: {
        progress: ProgressEnum.CONFIRMED,
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

  async getFilteringCounts(driverId: string, driverAvailableAreas: AreaType[]) {
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
            progress: ProgressEnum.OPEN,
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
        progress: ProgressEnum.OPEN,
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
        progress: ProgressEnum.OPEN,
      },
    });

    return { serviceTypeCounts, serviceAreaCount, designatedRequestCount };
  }

  async findByUserId(userId: string) {
    const moveInfo = await this.moveInfo.findMany({
      where: { ownerId: userId, progress: ProgressEnum.OPEN },
    });

    return moveInfo;
  }

  async findWithEstimationsByUserId(userId: string, paginationOptions: OffsetPaginationOptions) {
    const { page = 1, pageSize = 10 } = paginationOptions;

    const list = await this.moveInfo.findMany({
      where: { ownerId: userId, progress: { in: [ProgressEnum.CANCELED, ProgressEnum.COMPLETE] } },
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

  async postMoveInfo(moveData: CreateMoveDTO) {
    return await this.moveInfo.create({ data: moveData });
  }

  async update(id: string, data: MovePatchInputDTO) {
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
        progress: ProgressEnum.CONFIRMED, // 상태를 CONFIRMED로 업데이트
      },
    });
  }

  async updateToComplete(now: Date) {
    return this.moveInfo.updateMany({
      where: {
        progress: ProgressEnum.CONFIRMED,
        date: { lt: now },
        confirmedEstimationId: { not: null },
      },
      data: {
        progress: ProgressEnum.COMPLETE,
      },
    });
  }

  async updateToExpired(now: Date): Promise<string[]> {
    await this.moveInfo.updateMany({
      where: {
        progress: ProgressEnum.OPEN,
        confirmedEstimationId: null,
        date: { lt: now },
      },
      data: { progress: ProgressEnum.EXPIRED },
    });

    const expiredMoves = await this.moveInfo.findMany({
      where: {
        progress: ProgressEnum.EXPIRED,
        date: { lt: now }, // 만료된 ..
      },
      select: { id: true },
    });

    return expiredMoves.map(move => move.id);
  }

  // 자동만료 수정
  async findExpiredMoveInfoIds(): Promise<string[]> {
    const expiredMoves = await this.moveInfo.findMany({
      where: { progress: 'EXPIRED' },
      select: { id: true },
    });
    return expiredMoves.map(move => move.id);
  }
}

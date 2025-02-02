import { PrismaService } from '#global/prisma.service.js';
import { IMoveRepository } from '#move/interfaces/move.repository.interface.js';
import { MoveInfo, MoveInfoInputDTO } from '#move/move.types.js';
import { IsActivate, MoveInfoSortOrder } from '#types/options.type.js';
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

  private getBaseWhereCondition(options: MoveInfoGetQueries, driverId: string, driverAvailableAreas: Area[]) {
    const { keyword, serviceType, serviceArea, designatedRequest } = options;

    const serviceTypes = serviceType
      ? serviceType
          .split(/[,+\s]/)
          .map(type => type.trim())
          .filter(type => type)
      : undefined;

    const baseWhereCondition = {
      AND: [
        ...(keyword
          ? [
              {
                OR: [
                  { owner: { name: { contains: keyword } } },
                  { fromAddress: { contains: keyword } },
                  { toAddress: { contains: keyword } },
                ],
              },
            ]
          : []),
        ...(serviceTypes?.length
          ? [
              {
                serviceType: { in: serviceTypes },
              },
            ]
          : []),

        ...(serviceArea === IsActivate.Active
          ? [
              {
                OR: [
                  ...driverAvailableAreas.map(area => ({
                    fromAddress: { contains: areaToKeyword(area) },
                  })),
                  ...driverAvailableAreas.map(area => ({
                    toAddress: { contains: areaToKeyword(area) },
                  })),
                ],
              },
            ]
          : []),
        ...(designatedRequest === IsActivate.Active && driverId
          ? [
              {
                requests: {
                  some: {
                    driverId: designatedRequest ? driverId : null,
                  },
                },
              },
            ]
          : []),
        {
          NOT: {
            estimations: {
              some: {
                driverId: driverId,
              },
            },
          },
        },
        { progress: Progress.OPEN },
      ],
    };

    return baseWhereCondition;
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

  async findMany(options: MoveInfoGetQueries, driverId: string, driverAvailableAreas: Area[]) {
    const { page = 1, pageSize = 10, orderBy } = options;
    const baseWhereCondition = this.getBaseWhereCondition(options, driverId, driverAvailableAreas);

    let orderByCondition;
    if (orderBy === MoveInfoSortOrder.UpcomingMoveDate) {
      orderByCondition = { date: 'asc' };
    } else if (orderBy === MoveInfoSortOrder.RecentRequest) {
      orderByCondition = { createdAt: 'desc' };
    } else {
      orderByCondition = { createdAt: 'desc' };
    }

    const list = await this.moveInfo.findMany({
      where: baseWhereCondition,
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

  async getTotalCount(options: MoveInfoGetQueries, driverId: string, driverAvailableAreas: Area[]) {
    const baseWhereCondition = this.getBaseWhereCondition(options, driverId, driverAvailableAreas);
    const totalCount = await this.moveInfo.count({ where: baseWhereCondition });

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

  async findWithEstimationsByUserId(userId: string) {
    const moveInfos = await this.moveInfo.findMany({
      where: { ownerId: userId, progress: { in: [Progress.CANCELED, Progress.COMPLETE] } },
      forceFind: true,
      include: { confirmedEstimation: true, estimations: true },
    });

    return moveInfos;
  }

  async findByMoveInfoId(moveInfoId: string): Promise<IMoveInfo> {
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
}

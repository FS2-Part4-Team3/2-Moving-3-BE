import { PrismaService } from '#global/prisma.service.js';
import { IMoveRepository } from '#move/interfaces/move.repository.interface.js';
import { MoveInfo, MoveInfoInputDTO } from '#move/move.types.js';
import { IsActivate, MoveInfoSortOrder } from '#types/options.type.js';
import { MoveInfoGetQueries } from '#types/queries.type.js';
import { areaToKeyword } from '#utils/address-utils.js';
import { Injectable } from '@nestjs/common';
import { Area, Progress } from '@prisma/client';

@Injectable()
export class MoveRepository implements IMoveRepository {
  private readonly moveInfo;
  constructor(private readonly prisma: PrismaService) {
    this.moveInfo = prisma.moveInfo;
  }

  async findMany(options: MoveInfoGetQueries, driverId: string, driverAvailableAreas: Area[]) {
    const { page = 1, pageSize = 10, orderBy, keyword, serviceType, serviceArea, designatedRequest } = options;
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
        { progress: Progress.OPEN },
      ],
    };

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

    const totalCount = await this.moveInfo.count({ where: baseWhereCondition });

    const serviceTypeCounts = await Promise.all(
      ['SMALL', 'HOME', 'OFFICE'].map(async type => ({
        type,
        count: await this.moveInfo.count({
          where: {
            ...baseWhereCondition,
            AND: [
              ...baseWhereCondition.AND,
              {
                serviceType: type,
              },
            ],
          },
        }),
      })),
    );

    const serviceAreaCount = await this.moveInfo.count({
      where: {
        ...baseWhereCondition,
        AND: [
          ...baseWhereCondition.AND,
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
        ],
      },
    });

    const designatedRequestCount = await this.moveInfo.count({
      where: {
        ...baseWhereCondition,
        AND: [
          ...baseWhereCondition.AND,
          {
            requests: {
              some: {
                driverId,
              },
            },
          },
        ],
      },
    });

    const addedList = list.map(moveInfo => ({
      ...moveInfo,
      isSpecificRequest: moveInfo.requests.some(req => req.driverId === driverId),
    }));

    return {
      totalCount,
      counts: {
        serviceTypeCounts,
        serviceAreaCount,
        designatedRequestCount,
      },
      list: addedList,
    };
  }

  async findByUserId(userId: string) {
    const moveInfo = await this.moveInfo.findMany({ where: { ownerId: userId, progress: Progress.OPEN } });

    return moveInfo;
  }

  async findByMoveInfoId(moveInfoId: string) {
    const moveInfo = await this.moveInfo.findUnique({ where: { id: moveInfoId } });

    return moveInfo;
  }

  async postMoveInfo(moveData: MoveInfoInputDTO & { ownerId : string, progress : Progress } ): Promise<MoveInfo> {
    return await this.moveInfo.create({ data: moveData });
  }

  async update(id: string, data: Partial<MoveInfoInputDTO>) {}

  async delete(id: string) {}
}

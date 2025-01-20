import { PrismaService } from '#global/prisma.service.js';
import { IMoveRepository } from '#move/interfaces/move.repository.interface.js';
import { MoveInfo, MoveInfoInputDTO } from '#move/move.types.js';
import { IsActivate, MoveInfoSortOrder } from '#types/options.type.js';
import { MoveInfoGetQueries } from '#types/queries.type.js';
import { areaToKeyword } from '#utils/address-utils.js';
import { Injectable } from '@nestjs/common';
import { Area, Progress } from '@prisma/client';
import { IMoveInfo } from './types/move.types.js';

@Injectable()
export class MoveRepository implements IMoveRepository {
  private readonly moveInfo;
  constructor(private readonly prisma: PrismaService) {
    this.moveInfo = prisma.moveInfo;
  }

  async findMany(options: MoveInfoGetQueries, driverId: string, driverAvailableAreas: Area[]) {
    const { page = 1, pageSize = 10, orderBy, keyword, serviceType, serviceArea, designatedRequest } = options;
    const serviceTypes = options.serviceType ? options.serviceType.split(',') : undefined;

    const whereCondition = {
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
        ...(serviceType
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
      orderByCondition = { date: 'desc' };
    } else if (orderBy === MoveInfoSortOrder.RecentRequest) {
      orderByCondition = { createdAt: 'asc' };
    } else {
      orderByCondition = { createdAt: 'asc' };
    }

    const list = await this.moveInfo.findMany({
      where: whereCondition,
      skip: (page - 1) * pageSize,
      take: pageSize,
      orderBy: orderByCondition,
      include: {
        owner: { select: { name: true } },
      },
    });

    const totalCount = await this.moveInfo.count({ where: whereCondition });

    return { totalCount, list };
  }

  async findByUserId(userId: string) {
    const moveInfo = await this.moveInfo.findMany({ where: { ownerId: userId, progress: Progress.OPEN } });

    return moveInfo;
  }

  /**
   * 동기 함수: 다 완료해야 다음코드가 실행
   * 비동기 함수: 지금 실행 안하고 다음코드 먼저 실행 완료되면 실행
   * -> Promise 객체를 반환
   * 반대로말하면 Promise 객체를 반환한다면 비동기함수임
   */
  async findByMoveInfoId(moveInfoId: string): Promise<IMoveInfo> {
    const moveInfo = await this.moveInfo.findUnique({
      where: { id: moveInfoId },
      include: {
        requests: true,
      },
    });

    return moveInfo;
  }

  async postMoveInfo(moveData: MoveInfoInputDTO): Promise<MoveInfo> {
    return await this.moveInfo.create({ data: moveData });
  }

  async update(id: string, data: Partial<MoveInfoInputDTO>) {}

  async delete(id: string) {}
}

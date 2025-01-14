import { PrismaService } from '#global/prisma.service.js';
import { IMoveRepository } from '#move/interfaces/move.repository.interface.js';
import { MoveInfoInputDTO } from '#move/move.types.js';
import { FindOptions, RequestFilter, SortOrder } from '#types/options.type.js';
import { GetQueries } from '#types/queries.type.js';
import { areaToKeyword } from '#utils/address-utils.js';
import { Injectable } from '@nestjs/common';
import { Area, Progress, ServiceType } from '@prisma/client';

@Injectable()
export class MoveRepository implements IMoveRepository {
  private readonly moveInfo;
  constructor(private readonly prisma: PrismaService) {
    this.moveInfo = prisma.moveInfo;
  }

  async findMany(options: GetQueries & Partial<RequestFilter>, driverId: string, driverAvailableAreas: Area[]) {
    const { page = 1, pageSize = 10, orderBy = SortOrder.Recent, keyword, moveType, serviceArea, designated } = options;

    const whereCondition = {
      ...(keyword && {
        OR: [
          { owner: { name: { contains: keyword } } },
          { fromAddress: { contains: keyword } },
          { toAddress: { contains: keyword } },
        ],
      }),
      ...(moveType && {
        type: moveType as ServiceType,
      }),

      ...(serviceArea && {
        OR: [
          ...driverAvailableAreas.map(area => ({
            fromAddress: { contains: areaToKeyword(area) },
          })),
          ...driverAvailableAreas.map(area => ({
            toAddress: { contains: areaToKeyword(area) },
          })),
        ],
      }),

      ...(designated &&
        driverId && {
          requests: {
            some: {
              driverId: designated ? driverId : null,
            },
          },
        }),
    };

    const list = await this.moveInfo.findMany({
      where: whereCondition,
      skip: (page - 1) * pageSize,
      take: pageSize,
      orderBy:
        orderBy === SortOrder.MoveDate
          ? { date: SortOrder.Recent ? 'desc' : 'asc' }
          : { createdAt: SortOrder.Recent ? 'desc' : 'asc' },
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

  async findByMoveInfoId(moveInfoId: string) {
    const moveInfo = await this.moveInfo.findUnique({ where: { id: moveInfoId } });

    return moveInfo;
  }

  async create(data: MoveInfoInputDTO) {}

  async update(id: string, data: Partial<MoveInfoInputDTO>) {}

  async delete(id: string) {}
}

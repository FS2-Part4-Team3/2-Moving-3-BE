import { PrismaService } from '#global/prisma.service.js';
import { IMoveRepository } from '#move/interfaces/move.repository.interface.js';
import { MoveInfoInputDTO } from '#move/move.types.js';
import { FindOptions, RequestFilter, SortOrder } from '#types/options.type.js';
import { Injectable } from '@nestjs/common';
import { Area, ServiceType, Progress } from '@prisma/client';

@Injectable()
export class MoveRepository implements IMoveRepository {
  private readonly moveInfo;
  constructor(private readonly prisma: PrismaService) {
    this.moveInfo = prisma.moveInfo;
  }

  async findMany(options?: FindOptions & RequestFilter, driverId?: string) {
    const { page = 1, pageSize = 10, orderBy = SortOrder.Recent, keyword, moveType, serviceArea, designated = true } = options;

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
        OR: [{ fromAddress: { contains: serviceArea } }, { toAddress: { contains: serviceArea } }],
        driver: {
          availableAreas: { has: serviceArea as Area },
        },
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
          ? { scheduledTime: SortOrder.Recent ? 'desc' : 'asc' }
          : { createdAt: SortOrder.Recent ? 'desc' : 'asc' },
      include: {
        owner: true,
        requests: true,
      },
    });

    const totalCount = await this.moveInfo.count({ where: whereCondition });
    console.log('totalCount', totalCount);

    return { totalCount, list };
  }

  async findById(userId: string) {
    const moveInfo = await this.moveInfo.findMany({ where: { ownerId: userId, progress: Progress.OPEN } });

    return moveInfo;
  }

  async create(data: MoveInfoInputDTO) {}

  async update(id: string, data: Partial<MoveInfoInputDTO>) {}

  async delete(id: string) {}
}

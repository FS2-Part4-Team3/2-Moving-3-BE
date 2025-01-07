import { PrismaService } from '#global/prisma.service.js';
import { IRequestRepository } from '#requests/interfaces/request.repository.interface.js';
import { RequestInputDTO } from '#requests/request.types.js';
import { FindOptions, SortOrder } from '#types/options.type.js';
import { Injectable } from '@nestjs/common';

@Injectable()
export class RequestRepository implements IRequestRepository {
  private readonly request;
  constructor(private readonly prisma: PrismaService) {
    this.request = prisma.request;
  }

  async totalCount(driverId: string) {
    const totalCount = await this.request.count({ where: { driverId } });

    return totalCount;
  }

  async findMany(driverId: string, options: FindOptions) {
    const { page, pageSize, orderBy, keyword } = options;

    const requests = await this.request.findMany({
      where: {
        driverId,
        OR: keyword
          ? [
              { description: { contains: keyword } },
              { pickupLocation: { contains: keyword } },
              { dropoffLocation: { contains: keyword } },
            ]
          : undefined,
      },
      skip: (page - 1) * pageSize,
      take: pageSize,
      orderBy:
        orderBy === 'MoveDate'
          ? { scheduledTime: SortOrder.Recent ? 'desc' : 'asc' }
          : { createdAt: SortOrder.Recent ? 'desc' : 'asc' },
    });

    return requests;
  }

  async findById(id: string) {}

  async create(data: RequestInputDTO) {}

  async update(id: string, data: Partial<RequestInputDTO>) {}

  async delete(id: string) {}
}

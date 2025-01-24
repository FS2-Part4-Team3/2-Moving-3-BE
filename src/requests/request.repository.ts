import { PrismaService } from '#global/prisma.service.js';
import { IRequestRepository } from '#requests/interfaces/request.repository.interface.js';
import { RequestInputDTO } from '#requests/request.types.js';
import { FindOptions } from '#types/options.type.js';
import { Injectable } from '@nestjs/common';
import { Progress } from '@prisma/client';

@Injectable()
export class RequestRepository implements IRequestRepository {
  private readonly request;
  constructor(private readonly prisma: PrismaService) {
    this.request = prisma.request;
  }
  async findMany(options: FindOptions) {}

  async findById(requestId: string) {
    const request = await this.request.findUnique({
      where: { id: requestId },
      include: { moveInfo: { select: { ownerId: true } } },
    });

    return request;
  }

  async create(data: RequestInputDTO) {
    const request = await this.request.create({ data });

    return request;
  }

  async update(id: string, data: Partial<RequestInputDTO>) {
    return await this.request.update({ where: { id }, data });
  }

  async delete(id: string) {
    const request = await this.request.delete({ where: { id } });

    return request;
  }
}

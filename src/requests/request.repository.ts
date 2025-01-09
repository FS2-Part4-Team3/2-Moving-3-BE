import { PrismaService } from '#global/prisma.service.js';
import { IRequestRepository } from '#requests/interfaces/request.repository.interface.js';
import { RequestInputDTO } from '#requests/request.types.js';
import { FindOptions } from '#types/options.type.js';
import { Injectable } from '@nestjs/common';

@Injectable()
export class RequestRepository implements IRequestRepository {
  private readonly request;
  private readonly moveInfo;
  constructor(private readonly prisma: PrismaService) {
    this.request = prisma.request;
    this.moveInfo = prisma.moveInfo;
  }

  async findmoveInfo(userId: string) {
    const moveInfo = await this.moveInfo.findMany({ where: { ownerId: userId, progress: 'OPEN' } });

    return moveInfo;
  }

  async findMany(options: FindOptions) {}

  async findById(id: string) {}

  async create(data: RequestInputDTO) {
    const request = await this.request.create({ data });

    return request;
  }

  async update(id: string, data: Partial<RequestInputDTO>) {}

  async delete(id: string) {}
}

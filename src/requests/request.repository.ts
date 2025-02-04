import { PrismaService } from '#global/prisma.service.js';
import { IRequestRepository } from '#requests/interfaces/request.repository.interface.js';
import { CreateRequestDTO, PatchRequestDTO, RequestInputDTO } from '#requests/request.types.js';
import { Injectable } from '@nestjs/common';

@Injectable()
export class RequestRepository implements IRequestRepository {
  private readonly request;
  constructor(private readonly prisma: PrismaService) {
    this.request = prisma.request;
  }
  async findById(requestId: string) {
    const request = await this.request.findUnique({
      where: { id: requestId },
      include: { moveInfo: { select: { ownerId: true } } },
    });

    return request;
  }

  async create(data: CreateRequestDTO) {
    const request = await this.request.create({ data });

    return request;
  }

  async update(id: string, data: PatchRequestDTO) {
    return await this.request.update({ where: { id }, data });
  }

  async delete(id: string) {
    const request = await this.request.delete({ where: { id } });

    return request;
  }
}

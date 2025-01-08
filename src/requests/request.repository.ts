import { PrismaService } from '#global/prisma.service.js';
import { IRequestRepository } from '#requests/interfaces/request.repository.interface.js';
import { RequestInputDTO } from '#requests/request.types.js';
import { FindOptions, RequestFilter, SortOrder } from '#types/options.type.js';
import { Injectable } from '@nestjs/common';
import { Area, ServiceType } from '@prisma/client';

@Injectable()
export class RequestRepository implements IRequestRepository {
  private readonly request;
  constructor(private readonly prisma: PrismaService) {
    this.request = prisma.request;
  }

  async findMany(options: FindOptions) {}

  async findById(id: string) {}

  async create(data: RequestInputDTO) {}

  async update(id: string, data: Partial<RequestInputDTO>) {}

  async delete(id: string) {}
}

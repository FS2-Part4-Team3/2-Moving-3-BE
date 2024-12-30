import { EstimationInputDTO } from '#estimations/estimation.types.js';
import { IEstimationRepository } from '#estimations/interfaces/estimation.repository.interface.js';
import { PrismaService } from '#global/prisma.service.js';
import { FindOptions } from '#types/options.type.js';
import { Injectable } from '@nestjs/common';

@Injectable()
export class EstimationRepository implements IEstimationRepository {
  private readonly estimation;
  constructor(private readonly prisma: PrismaService) {
    this.estimation = prisma.estimation;
  }

  async findMany(options: FindOptions) {}

  async findById(id: string) {}

  async create(data: EstimationInputDTO) {}

  async update(id: string, data: Partial<EstimationInputDTO>) {}

  async delete(id: string) {}
}

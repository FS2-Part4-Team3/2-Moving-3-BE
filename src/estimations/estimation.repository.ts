import { EstimationInputDTO, Estimation } from '#estimations/estimation.types.js';
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
  update: (id: string, data: Partial<EstimationInputDTO>) => void;
  delete: (id: string) => void;

  async findMany(options: FindOptions) {}

  async findById(id: string) {
    const estimation = await this.estimation.findUnique({ where: { id } });

    return estimation;
  }

  async create(data: EstimationInputDTO): Promise<Estimation> {
    return this.estimation.create({
      data: {
        moveInfoId: data.moveInfoId,
        driverId: data.driverId,
        price: data.price,
        comment: data.comment,
      },
    });
  }
}

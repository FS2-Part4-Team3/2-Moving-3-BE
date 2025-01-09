import { DriverInputDTO } from '#drivers/driver.types.js';
import { IDriverRepository } from '#drivers/interfaces/driver.repository.interface.js';
import { PrismaService } from '#global/prisma.service.js';
import { FindOptions } from '#types/options.type.js';
import { Injectable } from '@nestjs/common';

@Injectable()
export class DriverRepository implements IDriverRepository {
  private readonly driver;
  constructor(private readonly prisma: PrismaService) {
    this.driver = prisma.driver;
  }

  async findMany(options: FindOptions) {}

  async findById(id: string) {
    const driver = await this.driver.findUnique({ where: { id } });

    return driver;
  }

  async create(data: DriverInputDTO) {}

  async update(id: string, data: Partial<DriverInputDTO>) {}

  async delete(id: string) {}

  async like(driverId: string, userId: string) {
    const driver = await this.driver.update({
      where: { id: driverId },
      data: {
        likeCount: { increment: 1 },
        likeUsers: {
          connect: {
            id: userId,
          },
        },
      },
    });

    return driver;
  }

  async unlike(driverId: string, userId: string) {
    const driver = await this.driver.update({
      where: { id: driverId },
      data: {
        likeCount: { decrement: 1 },
        likeUsers: {
          disconnect: {
            id: userId,
          },
        },
      },
    });

    return driver;
  }
}

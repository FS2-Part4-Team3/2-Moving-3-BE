import { DriverInputDTO } from '#drivers/driver.types.js';
import { IDriverRepository } from '#drivers/interfaces/driver.repository.interface.js';
import { PrismaService } from '#global/prisma.service.js';
import { FindOptions, SortOrder } from '#types/options.type.js';
import { Injectable } from '@nestjs/common';

@Injectable()
export class DriverRepository implements IDriverRepository {
  private readonly driver;
  constructor(private readonly prisma: PrismaService) {
    this.driver = prisma.driver;
  }

  async count() {
    const count = await this.driver.count();

    return count;
  }

  async findMany(options: FindOptions) {
    const { page, pageSize, orderBy } = options;
    // prettier-ignore
    const sort = (
      orderBy === SortOrder.Oldest ? {createdAt: 'asc'} :
      orderBy === SortOrder.Latest ? {createdAt: 'desc'} : {createdAt: 'desc'}
    )

    const drivers = await this.driver.findMany({
      orderBy: sort,
      skip: (page - 1) * pageSize,
      take: pageSize,
    });

    return drivers;
  }

  async findById(id: string) {
    const driver = await this.driver.findUnique({ where: { id } });

    return driver;
  }

  async create(data: DriverInputDTO) {}

  async update(id: string, data: Partial<DriverInputDTO>) {}

  async delete(id: string) {}
}

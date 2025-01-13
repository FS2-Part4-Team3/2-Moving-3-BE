import { SignUpDTO } from '#auth/auth.types.js';
import { DriverUpdateDTO } from '#drivers/driver.types.js';
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

  async findByEmail(email: string) {
    const driver = await this.driver.findUnique({ where: { email } });

    return driver;
  }

  async createBySignUp(data: SignUpDTO) {
    const driver = await this.driver.create({ data });

    return driver;
  }

  async update(id: string, data: DriverUpdateDTO) {
    const driver = await this.driver.update({ where: { id }, data });

    return driver;
  }

  async delete(id: string) {}

  async like(driverId: string, userId: string) {
    const driver = await this.driver.update({
      where: { id: driverId },
      data: {
        likeCount: { increment: 1 },
        likedUsers: {
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
        likedUsers: {
          disconnect: {
            id: userId,
          },
        },
      },
    });

    return driver;
  }

  async isLiked(driverId: string, userId: string) {
    const driver = await this.driver.findUnique({
      where: {
        id: driverId,
        likedUsers: { some: { id: userId } },
      },
    });

    return !!driver;
  }
}

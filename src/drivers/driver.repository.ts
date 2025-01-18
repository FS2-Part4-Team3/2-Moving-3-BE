import { GoogleCreateDTO, SignUpDTO } from '#auth/auth.types.js';
import { DriverUpdateDTO } from '#drivers/driver.types.js';
import { IDriverRepository } from '#drivers/interfaces/driver.repository.interface.js';
import { PrismaService } from '#global/prisma.service.js';
import { DriversFindOptions, DriverSortOrder } from '#types/options.type.js';
import { Injectable } from '@nestjs/common';

@Injectable()
export class DriverRepository implements IDriverRepository {
  private readonly driver;
  constructor(private readonly prisma: PrismaService) {
    this.driver = prisma.driver;
  }

  private generateFindCondition(options: DriversFindOptions) {
    const { orderBy, keyword, area, serviceType, likedUserId } = options;

    let sort = {};
    switch (orderBy) {
      case DriverSortOrder.MostReviewed:
        sort = { reviews: { _count: 'desc' } };
        break;
      case DriverSortOrder.HighestRating:
        sort = { rating: 'desc' };
        break;
      case DriverSortOrder.MostApplied:
        sort = { applyCount: 'desc' };
        break;
      case DriverSortOrder.HighestCareer:
        sort = { startAt: 'asc' };
        break;
      default:
        sort = { createdAt: 'desc' };
    }

    const likedCondition = likedUserId ? { likedUsers: { some: { id: likedUserId } } } : {};
    const areaCondition = area ? { availableAreas: { has: area } } : {};
    const typeCondition = serviceType ? { serviceType: { has: serviceType } } : {};

    const where = {
      OR: [{ name: { contains: keyword } }, { introduce: { contains: keyword } }],
      ...likedCondition,
      ...areaCondition,
      ...typeCondition,
    };

    return {
      where,
      orderBy: sort,
    };
  }

  async count(options: DriversFindOptions) {
    const { where } = this.generateFindCondition(options);

    const count = await this.driver.count({ where });

    return count;
  }

  async findMany(options: DriversFindOptions) {
    const { page, pageSize } = options;

    const findCondition = this.generateFindCondition(options);

    const drivers = await this.driver.findMany({
      ...findCondition,
      skip: (page - 1) * pageSize,
      take: pageSize,
      include: {
        reviews: { select: { score: true } },
      },
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

  async createByGoogleCreateDTO(data: GoogleCreateDTO) {
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

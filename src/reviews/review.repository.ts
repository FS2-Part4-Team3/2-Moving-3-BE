import { PrismaService } from '#global/prisma.service.js';
import { IReviewRepository } from '#reviews/interfaces/review.repository.interface.js';
import { ReviewInputDTO } from '#reviews/review.types.js';
import { FindOptions, SortOrder } from '#types/options.type.js';
import { Injectable } from '@nestjs/common';

@Injectable()
export class ReviewRepository implements IReviewRepository {
  private readonly review;
  constructor(private readonly prisma: PrismaService) {
    this.review = prisma.review;
  }

  private async updateDriverRating(tx: any, driverId: string) {
    const rating = await tx.review.aggregate({
      where: { driverId },
      _avg: { score: true },
    });

    await tx.driver.update({
      where: { id: driverId },
      data: { rating: Number(rating._avg.score.toFixed(2)) || 0 },
    });
  }

  async totalCount(id: string, type: 'user' | 'driver') {
    const whereCondition = type === 'user' ? { ownerId: id } : type === 'driver' ? { driverId: id } : {};
    const totalCount = await this.review.count({ where: whereCondition });

    return totalCount;
  }

  async findManyMyReviews(userId: string, options: FindOptions) {
    console.log('findManyMyReviews called with:', userId, options);
    const { page, pageSize, orderBy } = options;

    const sort = orderBy === SortOrder.Recent ? { createdAt: 'desc' } : { createdAt: 'asc' };

    const list = await this.review.findMany({
      where: { ownerId: userId },
      orderBy: sort,
      skip: (page - 1) * pageSize,
      take: pageSize,
      include: {
        driver: { select: { name: true, image: true } },
        owner: {
          select: {
            moveInfos: {
              where: { progress: 'COMPLETE' },
              select: {
                type: true,
                date: true,
                confirmedEstimation: {
                  select: {
                    price: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    return list;
  }

  async findManyDriverReviews(driverId: string, options: FindOptions) {
    const { page, pageSize, orderBy } = options;

    const sort = orderBy === SortOrder.Recent ? { createdAt: 'desc' } : { createdAt: 'asc' };

    const list = await this.review.findMany({
      where: { driverId },
      orderBy: sort,
      skip: (page - 1) * pageSize,
      take: pageSize,
      include: {
        owner: {
          select: { name: true },
        },
      },
    });

    return list;
  }

  async findById(id: string) {}

  async create(data: ReviewInputDTO) {
    const review = await this.prisma.$transaction(async tx => {
      const review = await tx.review.create({ data });
      await this.updateDriverRating(tx, data.driverId);
      return review;
    });

    return review;
  }

  async update(id: string, data: Partial<ReviewInputDTO>) {
    const review = await this.prisma.$transaction(async tx => {
      const review = await tx.review.update({
        where: { id },
        data,
      });
      await this.updateDriverRating(tx, review.driverId);
      return review;
    });

    return review;
  }

  async delete(id: string) {
    const review = await this.prisma.$transaction(async tx => {
      const review = await tx.review.findUnique({
        where: { id },
      });
      await tx.review.delete({ where: { id } });
      await this.updateDriverRating(tx, review.driverId);

      return review;
    });

    return review;
  }
}

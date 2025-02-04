import { PrismaService } from '#global/prisma.service.js';
import { IReviewRepository } from '#reviews/interfaces/review.repository.interface.js';
import { CreateReviewDTO, PatchReviewDTO } from '#reviews/review.types.js';
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
    const { page, pageSize, orderBy } = options;

    const sort = orderBy === SortOrder.Recent ? { createdAt: 'desc' } : { createdAt: 'asc' };

    const list = await this.review.findMany({
      where: { ownerId: userId },
      orderBy: sort,
      skip: (page - 1) * pageSize,
      take: pageSize,
      include: {
        estimation: {
          select: {
            price: true,
            moveInfo: {
              select: {
                serviceType: true,
                date: true,
                requests: {
                  where: { status: 'APPLY' },
                  select: {
                    status: true,
                    driverId: true,
                  },
                },
              },
            },
            driver: {
              select: {
                name: true,
                image: true,
              },
            },
          },
        },
      },
    });

    const addedList = list.map(review => ({
      ...review,
      estimation: {
        ...review.estimation,
        moveInfo: {
          ...review.estimation.moveInfo,
          isSpecificRequest: review.estimation.moveInfo.requests.some(req => req.driverId === review.driverId),
        },
      },
    }));

    return addedList;
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

  async getDriverReviewStats(driverId: string) {
    const ratingStats = await this.review.groupBy({
      by: ['score'],
      where: { driverId },
      _count: true,
    });

    const averageRating = await this.review.aggregate({
      where: { driverId },
      _avg: { score: true },
    });

    const ratingCounts = Array(5)
      .fill(0)
      .map((_, index) => {
        const stat = ratingStats.find(s => s.score === index + 1);
        return stat ? stat._count : 0;
      });

    return {
      averageRating: Number(averageRating._avg.score?.toFixed(1)) || 0,
      ratingCounts,
    };
  }

  async findByReviewId(id: string) {
    const review = await this.review.findUnique({ where: { id } });

    return review;
  }

  async create(data: CreateReviewDTO) {
    const review = await this.prisma.$transaction(async tx => {
      const review = await tx.review.create({ data });
      await this.updateDriverRating(tx, data.driverId);
      return review;
    });

    return review;
  }

  async update(id: string, data: PatchReviewDTO) {
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

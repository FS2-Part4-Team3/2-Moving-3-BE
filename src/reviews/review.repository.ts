import { PrismaService } from '#global/prisma.service.js';
import { IReviewRepository } from '#reviews/interfaces/review.repository.interface.js';
import { FindOptions, SortOrder } from '#types/options.type.js';
import { GetQueries } from '#types/queries.type.js';
import { Injectable } from '@nestjs/common';
import { CreateReviewDTO, PatchReviewDTO } from './types/review.dto.js';

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

    const newRating = rating._avg?.score ? Number(rating._avg.score.toFixed(2)) : 0;

    await tx.driver.update({
      where: { id: driverId },
      data: { rating: newRating },
    });
  }

  async totalCount(id: string, type: 'user' | 'driver') {
    const whereCondition = type === 'user' ? { ownerId: id } : type === 'driver' ? { driverId: id } : {};
    const totalCount = await this.review.count({ where: whereCondition });

    return totalCount;
  }

  async findManyMyReviews(userId: string, options: GetQueries) {
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
          },
        },
        driver: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
      },
    });

    const addedList = list.map(review => ({
      ...review,
      estimation: {
        ...review.estimation,
        isSpecificRequest: review.estimation.moveInfo.requests.some(req => req.driverId === review.driverId),
      },
    }));

    return addedList;
  }

  async findManyDriverReviews(driverId: string, options: GetQueries) {
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

  async getDriverRatingStats(driverId: string) {
    const ratingStats = await this.review.groupBy({
      by: ['score'],
      where: { driverId },
      _count: true,
    });
    return ratingStats;
  }

  async getDriverAverageRating(driverId: string) {
    const { _avg } = await this.review.aggregate({
      where: { driverId },
      _avg: { score: true },
    });

    const averageRating = _avg.score;

    return averageRating;
  }

  async findByReviewId(id: string) {
    const review = await this.review.findUnique({ where: { id } });

    return review;
  }

  async findByDriverId(driverId: string) {
    const review = await this.review.findMany({ where: { driverId } });

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

  async update(id: string, data: Partial<PatchReviewDTO>) {
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

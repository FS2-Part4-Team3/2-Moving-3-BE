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

  async findManyMyReviews(userId: string, options: FindOptions) {
    console.log('findManyMyReviews called with:', userId, options);
    const { page, pageSize, orderBy } = options;

    const sort = orderBy === SortOrder.Recent ? { createdAt: 'desc' } : { createdAt: 'asc' };

    // TODO
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

    const totalCount = await this.review.count({
      where: {
        ownerId: userId,
      },
    });

    return { totalCount, list };
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

    const totalCount = await this.review.count({
      where: {
        driverId,
      },
    });

    return { totalCount, list };
  }

  async findById(id: string) {}

  async create(data: ReviewInputDTO) {
    const review = await this.review.create({ data });

    return review;
  }

  async update(id: string, data: Partial<ReviewInputDTO>) {
    const review = await this.review.update({ where: { id }, data });

    return review;
  }

  async delete(id: string) {
    const review = await this.review.delete({ where: { id } });

    return review;
  }
}

import { PrismaService } from '#global/prisma.service.js';
import { IReviewRepository } from '#reviews/interfaces/review.repository.interface.js';
import { ReviewInputDTO } from '#reviews/review.types.js';
import { FindOptions } from '#types/options.type.js';
import { Injectable } from '@nestjs/common';

@Injectable()
export class ReviewRepository implements IReviewRepository {
  private readonly review;
  constructor(private readonly prisma: PrismaService) {
    this.review = prisma.review;
  }

  async findMany(options: FindOptions) {}

  async findById(id: string) {}

  async create(data: ReviewInputDTO) {
    const review = await this.review.create({ data });

    return review;
  }

  async update(id: string, data: Partial<ReviewInputDTO>) {}

  async delete(id: string) {}
}

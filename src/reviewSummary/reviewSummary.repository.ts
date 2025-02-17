import { Injectable } from '@nestjs/common';
import { PrismaService } from '#global/prisma.service.js';
import { IReviewSummaryRepository } from '#reviewSummary/interfaces/reviewSummary.repository.interface.js';

@Injectable()
export class ReviewSummaryRepository implements IReviewSummaryRepository {
  private readonly reviewSummary;
  constructor(private readonly prisma: PrismaService) {
    this.reviewSummary = prisma.reviewSummary;
  }

  async findByDriverId(driverId: string) {
    return this.reviewSummary.findUnique({
      where: { driverId },
    });
  }

  async createOrUpdate(driverId: string, summaryReview: string) {
    return this.reviewSummary.upsert({
      where: { driverId },
      update: { summary: summaryReview },
      create: { driverId, summary: summaryReview },
    });
  }
}

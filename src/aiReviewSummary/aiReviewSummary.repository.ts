import { Injectable } from '@nestjs/common';
import { PrismaService } from '#global/prisma.service.js';
import { IAiReviewSummaryRepository } from '#aiReviewSummary/interfaces/aiReviewSummary.repository.interface.js';

@Injectable()
export class AiReviewSummaryRepository implements IAiReviewSummaryRepository {
  private readonly aiReviewSummary;
  constructor(private readonly prisma: PrismaService) {
    this.aiReviewSummary = prisma.aiReviewSummary;
  }

  async findByDriverId(driverId: string) {
    return this.aiReviewSummary.findUnique({
      where: { driverId },
    });
  }

  async createOrUpdate(driverId: string, summaryReview: string) {
    return this.prisma.aiReviewSummary.upsert({
      where: { driverId },
      update: { summaryReview },
      create: { driverId, summaryReview },
    });
  }
}

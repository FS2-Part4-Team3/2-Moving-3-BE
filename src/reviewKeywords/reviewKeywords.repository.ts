import { PrismaService } from '#global/prisma.service.js';
import { Injectable } from '@nestjs/common';
import { IReviewKeywordsRepository } from './interfaces/reviewKeywords.repository.interface.js';
import { KeywordType } from '#types/common.types.js';

@Injectable()
export class ReviewKeywordsRepository implements IReviewKeywordsRepository {
  private readonly reviewKeywords;
  constructor(private readonly prisma: PrismaService) {
    this.reviewKeywords = prisma.reviewKeywords;
  }

  async findByDriverId(driverId: string) {
    return this.reviewKeywords.findMany({
      where: { driverId },
    });
  }

  async upsertKeywords(driverId: string, keyword: string, type: KeywordType, count: number) {
    return this.reviewKeywords.upsert({
      where: { driverId_keyword: { driverId, keyword } },
      update: { count },
      create: { driverId, keyword, type, count },
    });
  }

  async deleteKeywords(driverId: string, keywords: string[]) {
    return this.reviewKeywords.deleteMany({
      where: {
        driverId,
        keyword: { in: keywords },
      },
      forceDelete: true,
    });
  }
}

import { PrismaService } from '#global/prisma.service.js';
import { Injectable } from '@nestjs/common';
import { IReviewKeywordsRepository } from './interfaces/reviewKeywords.repository.interface.js';
import { KeywordType, KeywordTypeEnum } from '#types/common.types.js';
import { ReviewKeywordsGetQueries } from '#types/queries.type.js';
import { reviewKeywordSortOrder } from '#types/options.type.js';
import { reviewKeywordSortOrderType } from './types/reviewKeywords.types.js';

@Injectable()
export class ReviewKeywordsRepository implements IReviewKeywordsRepository {
  private readonly reviewKeywords;
  constructor(private readonly prisma: PrismaService) {
    this.reviewKeywords = prisma.reviewKeywords;
  }

  async findByDriverId(driverId: string) {
    return this.reviewKeywords.findMany({
      where: { driverId },
      select: { keyword: true, count: true, type: true },
    });
  }

  async findTopKeywords(driverId: string, orderBy: reviewKeywordSortOrderType) {
    const [positive, negative] = await Promise.all([
      this.reviewKeywords.findMany({
        where: { driverId, type: KeywordTypeEnum.POSITIVE },
        select: { keyword: true, count: true, type: true },
        take: 5,
        orderBy,
      }),
      this.reviewKeywords.findMany({
        where: { driverId, type: KeywordTypeEnum.NEGATIVE },
        select: { keyword: true, count: true, type: true },
        take: 5,
        orderBy,
      }),
    ]);

    return { positive, negative };
  }

  async findByType(driverId: string, type: KeywordType, page: number, pageSize: number, orderBy: reviewKeywordSortOrderType) {
    const [keywords, totalCount] = await Promise.all([
      this.reviewKeywords.findMany({
        where: { driverId, type },
        select: { keyword: true, count: true, type: true },
        skip: (page - 1) * pageSize,
        take: pageSize,
        orderBy,
      }),
      this.reviewKeywords.count({
        where: { driverId, type },
      }),
    ]);

    return { keywords, totalCount };
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

import { PrismaService } from '#global/prisma.service.js';
import { Injectable } from '@nestjs/common';
import { IReviewKeywordsRepository } from './interfaces/reviewKeywords.repository.interface.js';

@Injectable()
export class ReviewKeywordsRepository implements IReviewKeywordsRepository {
  private readonly reviewKeywords;
  constructor(private readonly prisma: PrismaService) {
    this.reviewKeywords = prisma.reviewKeywords;
  }
}

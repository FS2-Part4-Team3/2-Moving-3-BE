import { GoogleGeminiService } from '#global/ai-services/gemini.service.js';
import { ReviewRepository } from '#reviews/review.repository.js';
import { Injectable } from '@nestjs/common';
import { ReviewKeywordsRepository } from './reviewKeywords.repository.js';
import { IReviewKeywordsService } from './interfaces/reviewKeywords.service.interface.js';
import { ReviewNotFoundException } from '#reviews/review.exception.js';
import { KeywordTypeEnum } from '#types/common.types.js';
import { ReviewKeywordsGetQueries } from '#types/queries.type.js';
import { KeywordDTO } from './types/reviewKeywords.dto.js';

@Injectable()
export class ReviewKeywordsService implements IReviewKeywordsService {
  constructor(
    private readonly reviewKeywordsRepository: ReviewKeywordsRepository,
    private readonly reviewRepository: ReviewRepository,
    private readonly googleGeminiService: GoogleGeminiService,
  ) {}

  async findByDriverId(driverId: string, options: ReviewKeywordsGetQueries) {
    const results = await this.reviewKeywordsRepository.findByDriverId(driverId, options);

    const positive = results.filter(item => item.type === 'POSITIVE').map(item => ({ keyword: item.keyword, count: item.count }));
    const negative = results.filter(item => item.type === 'NEGATIVE').map(item => ({ keyword: item.keyword, count: item.count }));

    return { positive, negative };
  }

  async analyzeAiReviewKeywords(driverId: string) {
    const reviews = await this.reviewRepository.findByDriverId(driverId);
    if (!reviews.length) {
      throw new ReviewNotFoundException();
    }

    const reviewTexts = reviews.map(review => review.comment);

    // AI에게 키워드와 등장 횟수를 함께 추출하도록 요청
    const extractedKeywords = await this.googleGeminiService.extractKeywordsWithCount(reviewTexts.join('\n'));

    const existingKeywords = await this.reviewKeywordsRepository.findByDriverId(driverId);
    const existingKeywordMap = new Map(existingKeywords.map(k => [k.keyword, k]));

    // 새로운 키워드는 등장 횟수가 있을 때만 추가
    const newPositiveKeywords = extractedKeywords.positive.filter(k => !existingKeywordMap.has(k.keyword));
    const newNegativeKeywords = extractedKeywords.negative.filter(k => !existingKeywordMap.has(k.keyword));

    // 기존 키워드 업데이트
    for (const keyword of [...extractedKeywords.positive, ...extractedKeywords.negative]) {
      const count = keyword.count || 0;
      const type = extractedKeywords.positive.includes(keyword) ? KeywordTypeEnum.POSITIVE : KeywordTypeEnum.NEGATIVE;
      await this.reviewKeywordsRepository.upsertKeywords(driverId, keyword.keyword, type, count);
    }

    // 삭제할 키워드 제거 (AI의 결과에 없는 키워드)
    const removedKeywords = existingKeywords
      .filter(
        k =>
          !extractedKeywords.positive.some(p => p.keyword === k.keyword) &&
          !extractedKeywords.negative.some(n => n.keyword === k.keyword),
      )
      .map(k => k.keyword);

    if (removedKeywords.length > 0) {
      await this.reviewKeywordsRepository.deleteKeywords(driverId, removedKeywords);
    }

    return {
      addedKeywords: {
        positive: newPositiveKeywords,
        negative: newNegativeKeywords,
      },
      removedKeywords,
    };
  }
}

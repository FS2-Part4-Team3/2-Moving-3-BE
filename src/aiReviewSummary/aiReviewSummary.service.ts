import { Injectable } from '@nestjs/common';
import { IAiReviewSummaryService } from '#aiReviewSummary/interfaces/aiReviewSummary.service.interface.js';
import { AiReviewSummaryRepository } from '#aiReviewSummary/aiReviewSummary.repository.js';
import { ReviewRepository } from '#reviews/review.repository.js';
import { GoogleGeminiService } from '#global/ai-services/gemini.service.js';
import { AiReviewSummaryNotFoundException } from '#aiReviewSummary/aiReviewSummary.exception.js';
import { ReviewNotFoundException } from '#reviews/review.exception.js';

@Injectable()
export class AiReviewSummaryService implements IAiReviewSummaryService {
  constructor(
    private readonly aiReviewSummaryRepository: AiReviewSummaryRepository,
    private readonly reviewRepository: ReviewRepository,
    private readonly googleGeminiService: GoogleGeminiService,
  ) {}

  async getAiReviewSummary(driverId: string) {
    const summary = await this.aiReviewSummaryRepository.findByDriverId(driverId);
    if (!summary) {
      throw new AiReviewSummaryNotFoundException();
    }
    return summary;
  }

  async generateAiReviewSummary(driverId: string) {
    // 특정 드라이버의 리뷰 가져오기
    const reviews = await this.reviewRepository.findByDriverId(driverId);
    console.log('reviewsreviewsreviews', reviews);
    if (!reviews.length) {
      throw new ReviewNotFoundException();
    }

    // AI 모델을 이용해 리뷰 요약 생성
    const reviewTexts = reviews.map(review => review.comment).join('\n');
    console.log('reviewTextsreviewTextsreviewTexts', reviewTexts);
    const aiSummary = await this.googleGeminiService.summarizeReviews(reviewTexts);
    console.log('aiSummaryaiSummaryaiSummary', aiSummary);

    // AI 요약 저장 (기존 데이터 있으면 업데이트)
    return this.aiReviewSummaryRepository.createOrUpdate(driverId, aiSummary);
  }
}

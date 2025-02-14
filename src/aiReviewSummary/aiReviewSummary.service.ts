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
    const reviews = await this.reviewRepository.findByDriverId(driverId);
    if (!reviews.length) {
      throw new ReviewNotFoundException();
    }

    const reviewTexts = reviews.map(review => review.comment).join('\n');

    const aiSummary = await this.googleGeminiService.summarizeReviews(reviewTexts);

    return this.aiReviewSummaryRepository.createOrUpdate(driverId, aiSummary);
  }
}

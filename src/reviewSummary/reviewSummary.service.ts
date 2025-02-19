import { Injectable } from '@nestjs/common';
import { IReviewSummaryService } from '#reviewSummary/interfaces/reviewSummary.service.interface.js';
import { ReviewSummaryRepository } from '#reviewSummary/reviewSummary.repository.js';
import { ReviewRepository } from '#reviews/review.repository.js';
import { GoogleGeminiService } from '#global/ai-services/gemini.service.js';
import { AiReviewSummaryNotFoundException } from '#reviewSummary/reviewSummary.exception.js';
import { ReviewNotFoundException } from '#reviews/review.exception.js';

@Injectable()
export class ReviewSummaryService implements IReviewSummaryService {
  constructor(
    private readonly reviewSummaryRepository: ReviewSummaryRepository,
    private readonly reviewRepository: ReviewRepository,
    private readonly googleGeminiService: GoogleGeminiService,
  ) {}

  async getAiReviewSummary(driverId: string) {
    const summary = await this.reviewSummaryRepository.findByDriverId(driverId);
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

    return this.reviewSummaryRepository.createOrUpdate(driverId, aiSummary);
  }
}

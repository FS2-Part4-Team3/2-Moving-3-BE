import { GoogleGeminiService } from '#global/ai-services/gemini.service.js';
import { ReviewRepository } from '#reviews/review.repository.js';
import { Injectable } from '@nestjs/common';
import { ReviewKeywordsRepository } from './reviewKeywords.repository.js';
import { IReviewKeywordsService } from './interfaces/reviewKeywords.service.interface.js';

@Injectable()
export class ReviewKeywordsService implements IReviewKeywordsService {
  constructor(
    private readonly reviewKeywordsRepository: ReviewKeywordsRepository,
    private readonly reviewRepository: ReviewRepository,
    private readonly googleGeminiService: GoogleGeminiService,
  ) {}
}

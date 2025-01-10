import { IReviewService } from '#reviews/interfaces/review.service.interface.js';
import { Injectable } from '@nestjs/common';
import { ReviewRepository } from './review.repository.js';
import { ReviewInputDTO } from './review.types.js';
import { AsyncLocalStorage } from 'async_hooks';
import { IStorage } from '#types/common.types.js';

@Injectable()
export class ReviewService implements IReviewService {
  constructor(
    private readonly reviewRepository: ReviewRepository,
    private readonly als: AsyncLocalStorage<IStorage>,
  ) {}

  async postReview(driverId: string, body: ReviewInputDTO) {
    const { userId } = this.als.getStore();
    const { comment, score } = body;

    const reviewData = { comment, score, ownerId: userId, driverId };

    const review = await this.reviewRepository.create(reviewData);

    return review;
  }
}

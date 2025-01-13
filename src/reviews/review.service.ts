import { IReviewService } from '#reviews/interfaces/review.service.interface.js';
import { Injectable } from '@nestjs/common';
import { ReviewRepository } from './review.repository.js';
import { ReviewInputDTO } from './review.types.js';
import { AsyncLocalStorage } from 'async_hooks';
import { IStorage } from '#types/common.types.js';
import { FindOptions } from '#types/options.type.js';

@Injectable()
export class ReviewService implements IReviewService {
  constructor(
    private readonly reviewRepository: ReviewRepository,
    private readonly als: AsyncLocalStorage<IStorage>,
  ) {}

  async getMyReviews(options: FindOptions) {
    const { userId } = this.als.getStore();

    const list = await this.reviewRepository.findManyMyReviews(userId, options);
    const totalCount = await this.reviewRepository.totalCount(userId, 'user');

    return { totalCount, list };
  }

  async getDriverReviews(driverId: string, options: FindOptions) {
    const list = await this.reviewRepository.findManyDriverReviews(driverId, options);
    const totalCount = await this.reviewRepository.totalCount(driverId, 'driver');

    return { totalCount, list };
  }

  async postReview(driverId: string, body: ReviewInputDTO) {
    const { userId } = this.als.getStore();
    const { comment, score } = body;

    const reviewData = { comment, score, ownerId: userId, driverId };

    const review = await this.reviewRepository.create(reviewData);

    return review;
  }

  async patchReview(reviewId: string, body: Partial<ReviewInputDTO>) {
    const review = await this.reviewRepository.update(reviewId, body);

    return review;
  }

  async deleteReview(reviewId: string) {
    const review = await this.reviewRepository.delete(reviewId);

    return review;
  }
}

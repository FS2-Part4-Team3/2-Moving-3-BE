import { IReviewService } from '#reviews/interfaces/review.service.interface.js';
import { IStorage } from '#types/common.types.js';
import { FindOptions } from '#types/options.type.js';
import { Injectable } from '@nestjs/common';
import { AsyncLocalStorage } from 'async_hooks';
import { ReviewRepository } from './review.repository.js';
import { ReviewInputDTO } from './review.types.js';
import { ForbiddenException } from '#exceptions/http.exception.js';
import { ReviewAlreadyExistsException, ReviewNotFoundException } from './review.exception.js';
import { EstimationRepository } from '#estimations/estimation.repository.js';

@Injectable()
export class ReviewService implements IReviewService {
  constructor(
    private readonly estimationRepository: EstimationRepository,
    private readonly reviewRepository: ReviewRepository,
    private readonly als: AsyncLocalStorage<IStorage>,
  ) {}

  async getMyReviews(options: FindOptions) {
    const { userId } = this.als.getStore();

    if (!userId) {
      throw new ForbiddenException();
    }

    const list = await this.reviewRepository.findManyMyReviews(userId, options);
    const totalCount = await this.reviewRepository.totalCount(userId, 'user');

    return { totalCount, list };
  }

  async getDriverReviews(driverId: string, options: FindOptions) {
    const list = await this.reviewRepository.findManyDriverReviews(driverId, options);
    const totalCount = await this.reviewRepository.totalCount(driverId, 'driver');

    return { totalCount, list };
  }

  async postReview(estimationId: string, body: ReviewInputDTO) {
    const { userId } = this.als.getStore();
    const { comment, score } = body;

    const { driverId, reviews } = await this.estimationRepository.findById(estimationId);
    const existingReview = reviews.find(review => review.estimationId === estimationId && review.ownerId === userId);

    if (existingReview) {
      throw new ReviewAlreadyExistsException();
    }

    const reviewData = { comment, score, ownerId: userId, driverId, estimationId };

    const review = await this.reviewRepository.create(reviewData);

    return review;
  }

  async patchReview(reviewId: string, body: Partial<ReviewInputDTO>) {
    const { userId } = this.als.getStore();
    const reviewInfo = await this.reviewRepository.findByReviewId(reviewId);
    if (!reviewInfo) {
      throw new ReviewNotFoundException();
    }
    if (reviewInfo.ownerId !== userId) {
      throw new ForbiddenException();
    }

    const review = await this.reviewRepository.update(reviewId, body);

    return review;
  }

  async deleteReview(reviewId: string) {
    const { userId } = this.als.getStore();
    const reviewInfo = await this.reviewRepository.findByReviewId(reviewId);
    if (!reviewInfo) {
      throw new ReviewNotFoundException();
    }
    if (reviewInfo.ownerId !== userId) {
      throw new ForbiddenException();
    }

    const review = await this.reviewRepository.delete(reviewId);

    return review;
  }
}

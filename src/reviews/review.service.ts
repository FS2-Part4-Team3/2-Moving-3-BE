import { IReviewService } from '#reviews/interfaces/review.service.interface.js';
import { IStorage } from '#types/common.types.js';
import { Injectable } from '@nestjs/common';
import { AsyncLocalStorage } from 'async_hooks';
import { ReviewRepository } from './review.repository.js';
import { ForbiddenException } from '#exceptions/http.exception.js';
import { ReviewAlreadyExistsException, ReviewNotFoundException } from './review.exception.js';
import { EstimationRepository } from '#estimations/estimation.repository.js';
import { GetQueries } from '#types/queries.type.js';
import { PatchReviewDTO, ReviewBodyDTO } from './types/review.dto.js';
import filterSensitiveData from '#utils/filterSensitiveData.js';

@Injectable()
export class ReviewService implements IReviewService {
  constructor(
    private readonly estimationRepository: EstimationRepository,
    private readonly reviewRepository: ReviewRepository,
    private readonly als: AsyncLocalStorage<IStorage>,
  ) {}

  async getMyReviews(options: GetQueries) {
    const userId = this.als.getStore()?.userId;

    if (!userId) {
      throw new ForbiddenException();
    }

    const [list, totalCount] = await Promise.all([
      this.reviewRepository.findManyMyReviews(userId, options),
      this.reviewRepository.totalCount(userId, 'user'),
    ]);

    return {
      totalCount,
      list: await Promise.all(
        list.map(async review => ({
          ...review,
          driver: await filterSensitiveData(review.driver),
        })),
      ),
    };
  }

  async getDriverReviews(driverId: string, options: GetQueries) {
    const list = await this.reviewRepository.findManyDriverReviews(driverId, options);
    const totalCount = await this.reviewRepository.totalCount(driverId, 'driver');
    const ratingStats = await this.reviewRepository.getDriverRatingStats(driverId);
    const averageRating = await this.reviewRepository.getDriverAverageRating(driverId);

    const ratingCounts = Array(5)
      .fill(0)
      .map((_, index) => {
        const stat = ratingStats.find(s => s.score === index + 1);
        return stat ? stat._count : 0;
      });

    const stats = { averageRating: Number(averageRating?.toFixed(1)) || 0, ratingCounts };

    return { totalCount, stats, list };
  }

  async postReview(estimationId: string, body: ReviewBodyDTO) {
    const store = this.als.getStore();
    const userId = store?.userId;
    const { comment, score } = body;

    const { driverId, reviews = [] } = await this.estimationRepository.findById(estimationId);
    const existingReview = reviews.find(review => review.estimationId === estimationId && review.ownerId === userId);

    if (existingReview) {
      throw new ReviewAlreadyExistsException();
    }

    const reviewData = { comment, score, ownerId: userId, driverId, estimationId };

    const review = await this.reviewRepository.create(reviewData);

    return review;
  }

  async patchReview(reviewId: string, body: Partial<PatchReviewDTO>) {
    const store = this.als.getStore();
    const userId = store?.userId;
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
    const store = this.als.getStore();
    const userId = store?.userId;
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

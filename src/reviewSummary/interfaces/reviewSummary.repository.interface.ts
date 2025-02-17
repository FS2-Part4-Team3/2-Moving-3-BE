import { IReviewSummary } from '#reviewSummary/types/reviewSummary.types.js';

export interface IReviewSummaryRepository {
  findByDriverId: (driverId: string) => Promise<IReviewSummary>;
  createOrUpdate: (driverId: string, summaryReview: string) => Promise<IReviewSummary>;
}

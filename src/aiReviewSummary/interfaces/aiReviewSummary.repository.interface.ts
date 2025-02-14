import { IAiReviewSummary } from '../types/aiReviewSummary.types.js';

export interface IAiReviewSummaryRepository {
  findByDriverId: (driverId: string) => Promise<IAiReviewSummary>;
  createOrUpdate: (driverId: string, summaryReview: string) => Promise<IAiReviewSummary>;
}

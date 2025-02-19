import { IReviewSummary } from '#reviewSummary/types/reviewSummary.types.js';

export interface IReviewSummaryService {
  getAiReviewSummary: (driverId: string) => Promise<IReviewSummary>;
  generateAiReviewSummary: (driverId: string) => Promise<IReviewSummary>;
}

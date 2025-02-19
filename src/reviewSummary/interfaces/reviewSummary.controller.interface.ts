import { IReviewSummary } from '#reviewSummary/types/reviewSummary.types.js';

export interface IReviewSummaryController {
  getAiReviewSummary: (driverId: string) => Promise<IReviewSummary>;
  generateAiReviewSummary: (driverId: string) => Promise<IReviewSummary>;
}

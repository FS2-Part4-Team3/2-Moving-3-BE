import { IAiReviewSummary } from '#aiReviewSummary/types/aiReviewSummary.types.js';

export interface IAiReviewSummaryService {
  getAiReviewSummary: (driverId: string) => Promise<IAiReviewSummary>;
  generateAiReviewSummary: (driverId: string) => Promise<IAiReviewSummary>;
}

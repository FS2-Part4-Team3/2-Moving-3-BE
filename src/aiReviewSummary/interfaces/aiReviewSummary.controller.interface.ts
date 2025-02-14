import { IAiReviewSummary } from '../types/aiReviewSummary.types.js';

export interface IAiReviewSummaryController {
  getAiReviewSummary: (driverId: string) => Promise<IAiReviewSummary>;
  generateAiReviewSummary: (driverId: string) => Promise<IAiReviewSummary>;
}

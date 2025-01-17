import { Review, ReviewInputDTO } from '#reviews/review.types.js';
import { FindOptions } from '#types/options.type.js';

export interface IReviewController {
  getMyReviews: (options: FindOptions) => Promise<{ totalCount: number; list: Review[] }>;
  getDriverReviews: (driverId: string, options: FindOptions) => Promise<{ totalCount: number; list: Review[] }>;
  postReview: (estimationId: string, body: ReviewInputDTO) => Promise<Review>;
  patchReview: (reviewId: string, body: Partial<ReviewInputDTO>) => Promise<Review>;
  deleteReview: (reviewId: string) => Promise<Review>;
}

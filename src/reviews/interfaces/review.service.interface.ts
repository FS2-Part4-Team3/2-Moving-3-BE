import { Review, ReviewInputDTO } from '#reviews/review.types.js';
import { FindOptions } from '#types/options.type.js';

export interface IReviewService {
  getDriverReviews: (driverId: string, options: FindOptions) => Promise<{ totalCount: number; list: Review[] }>;
  postReview: (driverId: string, body: ReviewInputDTO) => Promise<Review>;
  patchReview: (reviewId: string, body: Partial<ReviewInputDTO>) => Promise<Review>;
  deleteReview: (reviewId: string) => Promise<Review>;
}

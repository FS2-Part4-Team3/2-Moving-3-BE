import { Review, ReviewInputDTO } from '#reviews/review.types.js';

export interface IReviewController {
  postReview: (driverId: string, body: ReviewInputDTO) => Promise<Review>;
  patchReview: (reviewId: string, body: Partial<ReviewInputDTO>) => Promise<Review>;
  deleteReview: (reviewId: string) => Promise<Review>;
}

import { Review, ReviewInputDTO } from '#reviews/review.types.js';

export interface IReviewController {
  postReview: (driverId: string, body: ReviewInputDTO) => Promise<Review>;
}

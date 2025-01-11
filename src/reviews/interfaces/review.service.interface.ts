import { Review, ReviewInputDTO } from '#reviews/review.types.js';

export interface IReviewService {
  postReview: (driverId: string, body: ReviewInputDTO) => Promise<Review>;
}

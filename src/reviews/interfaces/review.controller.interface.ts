import { ReviewInputDTO } from '#reviews/review.types.js';
import { Review } from '@prisma/client';

export interface IReviewController {
  postReview: (driverId: string, body: ReviewInputDTO) => Promise<Review>;
}

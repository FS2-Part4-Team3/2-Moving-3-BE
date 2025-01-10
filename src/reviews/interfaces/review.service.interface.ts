import { ReviewInputDTO } from '#reviews/review.types.js';
import { Review } from '@prisma/client';

export interface IReviewService {
  postReview: (driverId: string, body: ReviewInputDTO) => Promise<Review>;
}

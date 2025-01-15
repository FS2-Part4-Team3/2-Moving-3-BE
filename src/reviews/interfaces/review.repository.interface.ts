import { Review, ReviewInputDTO } from '#reviews/review.types.js';
import { FindOptions } from '#types/options.type.js';

export interface IReviewRepository {
  findManyMyReviews: (userId: string, options: FindOptions) => Promise<Review[]>;
  findManyDriverReviews: (driverId: string, options: FindOptions) => Promise<Review[]>;
  findByReviewId: (id: string) => Promise<Review>;
  create: (data: ReviewInputDTO) => Promise<Review>;
  update: (id: string, data: Partial<ReviewInputDTO>) => Promise<Review>;
  delete: (id: string) => Promise<Review>;
}

import { Review, ReviewInputDTO } from '#reviews/review.types.js';
import { FindOptions } from '#types/options.type.js';

export interface IReviewRepository {
  findManyDriverReviews: (driverId: string, options: FindOptions) => Promise<{ totalCount: number; list: Review[] }>;
  findById: (id: string) => void;
  create: (data: ReviewInputDTO) => Promise<Review>;
  update: (id: string, data: Partial<ReviewInputDTO>) => Promise<Review>;
  delete: (id: string) => Promise<Review>;
}

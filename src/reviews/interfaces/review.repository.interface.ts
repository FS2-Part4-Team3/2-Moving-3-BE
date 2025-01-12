import { Review, ReviewInputDTO } from '#reviews/review.types.js';
import { FindOptions } from '#types/options.type.js';

export interface IReviewRepository {
  findMany: (options: FindOptions) => void;
  findById: (id: string) => void;
  create: (data: ReviewInputDTO) => Promise<Review>;
  update: (id: string, data: Partial<ReviewInputDTO>) => void;
  delete: (id: string) => void;
}

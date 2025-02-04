import { CreateReviewDTO, IReivew, PatchReviewDTO, statsDTO } from '#reviews/review.types.js';
import { FindOptions } from '#types/options.type.js';

export interface IReviewRepository {
  findManyMyReviews: (userId: string, options: FindOptions) => Promise<IReivew[]>;
  findManyDriverReviews: (driverId: string, options: FindOptions) => Promise<IReivew[]>;
  getDriverReviewStats: (driverId: string) => Promise<statsDTO>;
  findByReviewId: (id: string) => Promise<IReivew>;
  create: (data: CreateReviewDTO) => Promise<IReivew>;
  update: (id: string, data: PatchReviewDTO) => Promise<IReivew>;
  delete: (id: string) => Promise<IReivew>;
}

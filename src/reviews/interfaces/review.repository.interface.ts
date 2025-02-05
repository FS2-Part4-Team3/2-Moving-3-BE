import {
  CreateReviewDTO,
  DriverReviewOutputDTO,
  IReivew,
  MyReviewOutputDTO,
  PatchReviewDTO,
  ratingStatsDTO,
} from '#reviews/review.types.js';
import { FindOptions } from '#types/options.type.js';

export interface IReviewRepository {
  findManyMyReviews: (userId: string, options: FindOptions) => Promise<MyReviewOutputDTO[]>;
  findManyDriverReviews: (driverId: string, options: FindOptions) => Promise<DriverReviewOutputDTO[]>;
  getDriverRatingStats: (driverId: string) => Promise<ratingStatsDTO[]>;
  getDriverAverageRating: (driverId: string) => Promise<number>;
  findByReviewId: (id: string) => Promise<IReivew>;
  create: (data: CreateReviewDTO) => Promise<IReivew>;
  update: (id: string, data: PatchReviewDTO) => Promise<IReivew>;
  delete: (id: string) => Promise<IReivew>;
}

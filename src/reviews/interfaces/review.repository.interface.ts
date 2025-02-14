import {
  CreateReviewDTO,
  DriverReviewOutputDTO,
  MyReviewOutputDTO,
  PatchReviewDTO,
  ratingStatsDTO,
} from '#reviews/types/review.dto.js';
import { IReivew } from '#reviews/types/review.types.js';
import { GetQueries } from '#types/queries.type.js';

export interface IReviewRepository {
  totalCount: (id: string, type: 'user' | 'driver') => Promise<number>;
  findManyMyReviews: (userId: string, options: GetQueries) => Promise<MyReviewOutputDTO[]>;
  findManyDriverReviews: (driverId: string, options: GetQueries) => Promise<DriverReviewOutputDTO[]>;
  getDriverRatingStats: (driverId: string) => Promise<ratingStatsDTO[]>;
  getDriverAverageRating: (driverId: string) => Promise<number>;
  findByReviewId: (id: string) => Promise<IReivew>;
  findByDriverId: (driverId: string) => Promise<IReivew[]>;
  create: (data: CreateReviewDTO) => Promise<IReivew>;
  update: (id: string, data: Partial<PatchReviewDTO>) => Promise<IReivew>;
  delete: (id: string) => Promise<IReivew>;
}

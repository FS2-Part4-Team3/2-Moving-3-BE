import { ReviewBodyDTO, statsDTO, PatchReviewDTO, IReivew } from '#reviews/review.types.js';
import { FindOptions } from '#types/options.type.js';

export interface IReviewController {
  getMyReviews: (options: FindOptions) => Promise<{ totalCount: number; list: IReivew[] }>;
  getDriverReviews: (driverId: string, options: FindOptions) => Promise<{ totalCount: number; stats: statsDTO; list: IReivew[] }>;
  postReview: (estimationId: string, body: ReviewBodyDTO) => Promise<IReivew>;
  patchReview: (reviewId: string, body: PatchReviewDTO) => Promise<IReivew>;
  deleteReview: (reviewId: string) => Promise<IReivew>;
}

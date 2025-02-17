import { DriverReviewResponseDTO, MyReviewResponseDTO, PatchReviewDTO, ReviewBodyDTO } from '#reviews/types/review.dto.js';
import { IReivew } from '#reviews/types/review.types.js';
import { FindOptions } from '#types/options.type.js';

export interface IReviewController {
  getMyReviews: (options: FindOptions) => Promise<MyReviewResponseDTO>;
  getDriverReviews: (driverId: string, options: FindOptions) => Promise<DriverReviewResponseDTO>;
  postReview: (estimationId: string, body: ReviewBodyDTO) => Promise<IReivew>;
  patchReview: (reviewId: string, body: Partial<PatchReviewDTO>) => Promise<IReivew>;
  deleteReview: (reviewId: string) => Promise<IReivew>;
}

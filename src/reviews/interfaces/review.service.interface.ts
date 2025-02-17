import { DriverReviewResponseDTO, MyReviewResponseDTO, PatchReviewDTO, ReviewBodyDTO } from '#reviews/types/review.dto.js';
import { IReivew } from '#reviews/types/review.types.js';
import { GetQueries } from '#types/queries.type.js';

export interface IReviewService {
  getMyReviews: (options: GetQueries) => Promise<MyReviewResponseDTO>;
  getDriverReviews: (driverId: string, options: GetQueries) => Promise<DriverReviewResponseDTO>;
  postReview: (estimationId: string, body: ReviewBodyDTO) => Promise<IReivew>;
  patchReview: (reviewId: string, body: Partial<PatchReviewDTO>) => Promise<IReivew>;
  deleteReview: (reviewId: string) => Promise<IReivew>;
}

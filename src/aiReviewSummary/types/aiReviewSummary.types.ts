export interface IAiReviewSummary {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;

  summaryReview: string;

  driverId: string;
}

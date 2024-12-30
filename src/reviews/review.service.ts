import { IReviewService } from '#reviews/interfaces/review.service.interface.js';
import { Injectable } from '@nestjs/common';

@Injectable()
export class ReviewService implements IReviewService {
  constructor() {}
}

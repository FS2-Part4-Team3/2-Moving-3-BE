import { DBModule } from '#global/db.module.js';
import { ReviewController } from '#reviews/review.controller.js';
import { ReviewRepository } from '#reviews/review.repository.js';
import { ReviewService } from '#reviews/review.service.js';
import { Module } from '@nestjs/common';

@Module({
  imports: [DBModule],
  controllers: [ReviewController],
  providers: [ReviewService, ReviewRepository],
})
export class ReviewModule {}

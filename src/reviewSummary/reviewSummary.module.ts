import { DBModule } from '#global/db.module.js';
import { GuardModule } from '#guards/guard.module.js';
import { Module } from '@nestjs/common';
import { ReviewSummaryController } from '#reviewSummary/reviewSummary.controller.js';
import { ReviewSummaryService } from '#reviewSummary/reviewSummary.service.js';
import { ReviewSummaryRepository } from '#reviewSummary/reviewSummary.repository.js';
import { GoogleGeminiService } from '#global/ai-services/gemini.service.js';
import { ReviewModule } from '#reviews/review.module.js';
import { DriverModule } from '#drivers/driver.module.js';
import { AiReviewSummaryScheduler } from './reviewSummary.scheduler.js';

@Module({
  imports: [DBModule, GuardModule, ReviewModule, DriverModule],
  controllers: [ReviewSummaryController],
  providers: [ReviewSummaryService, ReviewSummaryRepository, GoogleGeminiService, AiReviewSummaryScheduler],
  exports: [ReviewSummaryRepository],
})
export class ReviewSummaryModule {}

import { DBModule } from '#global/db.module.js';
import { GuardModule } from '#guards/guard.module.js';
import { Module } from '@nestjs/common';
import { AiReviewSummaryController } from '#aiReviewSummary/aiReviewSummary.controller.js';
import { AiReviewSummaryService } from '#aiReviewSummary/aiReviewSummary.service.js';
import { AiReviewSummaryRepository } from '#aiReviewSummary/aiReviewSummary.repository.js';
import { GoogleGeminiService } from '#global/ai-services/gemini.service.js';
import { ReviewModule } from '#reviews/review.module.js';
import { DriverModule } from '#drivers/driver.module.js';
import { AiReviewSummaryScheduler } from './aiReviewSummary.scheduler.js';

@Module({
  imports: [DBModule, GuardModule, ReviewModule, DriverModule],
  controllers: [AiReviewSummaryController],
  providers: [AiReviewSummaryService, AiReviewSummaryRepository, GoogleGeminiService, AiReviewSummaryScheduler],
  exports: [AiReviewSummaryRepository],
})
export class AiReviewSummaryModule {}

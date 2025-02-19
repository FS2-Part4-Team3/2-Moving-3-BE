import { DriverModule } from '#drivers/driver.module.js';
import { DBModule } from '#global/db.module.js';
import { GuardModule } from '#guards/guard.module.js';
import { ReviewModule } from '#reviews/review.module.js';
import { Module } from '@nestjs/common';
import { ReviewKeywordsController } from './reviewKeywords.controller.js';
import { ReviewKeywordsRepository } from './reviewKeywords.repository.js';
import { ReviewKeywordsService } from './reviewKeywords.service.js';
import { GoogleGeminiService } from '#global/ai-services/gemini.service.js';
import { AiReviewKeywordsScheduler } from './reviewKeywords.scheduler.js';

@Module({
  imports: [DBModule, GuardModule, ReviewModule, DriverModule],
  controllers: [ReviewKeywordsController],
  providers: [ReviewKeywordsService, ReviewKeywordsRepository, GoogleGeminiService, AiReviewKeywordsScheduler],
  exports: [ReviewKeywordsRepository],
})
export class ReviewKeywordsModule {}

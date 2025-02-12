import { Controller, Get, Param, Post } from '@nestjs/common';
import { AiReviewSummaryService } from '#aiReviewSummary/aiReviewSummary.service.js';

@Controller('reviewSummary')
export class AiReviewSummaryController {
  constructor(private readonly aiReviewSummaryService: AiReviewSummaryService) {}

  @Get(':driverId')
  async getAiReviewSummary(@Param('driverId') driverId: string) {
    return this.aiReviewSummaryService.getAiReviewSummary(driverId);
  }

  @Post(':driverId')
  async generateAiReviewSummary(@Param('driverId') driverId: string) {
    return this.aiReviewSummaryService.generateAiReviewSummary(driverId);
  }
}

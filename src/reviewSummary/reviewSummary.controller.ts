import { Controller, Get, HttpStatus, Param, Post } from '@nestjs/common';
import { ReviewSummaryService } from '#reviewSummary/reviewSummary.service.js';
import { ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger';
import { ReviewSummaryResponseDTO } from './types/reviewSummary.dto.js';

@Controller('reviewSummary')
export class ReviewSummaryController {
  constructor(private readonly reviewSummaryService: ReviewSummaryService) {}

  @Get(':driverId')
  @ApiOperation({ summary: '기사의 요약된 AI리뷰 조회' })
  @ApiParam({ name: 'driverId', description: '기사 ID', type: 'string' })
  @ApiResponse({
    status: HttpStatus.OK,
    type: ReviewSummaryResponseDTO,
  })
  async getAiReviewSummary(@Param('driverId') driverId: string) {
    return this.reviewSummaryService.getAiReviewSummary(driverId);
  }

  @Post(':driverId')
  @ApiOperation({ summary: '기사의 AI리뷰 생성/업데이트' })
  @ApiParam({ name: 'driverId', description: '기사 ID', type: 'string' })
  @ApiResponse({
    status: HttpStatus.OK,
    type: ReviewSummaryResponseDTO,
  })
  async generateAiReviewSummary(@Param('driverId') driverId: string) {
    return this.reviewSummaryService.generateAiReviewSummary(driverId);
  }
}

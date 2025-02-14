import { Controller, Get, HttpStatus, Param, Post } from '@nestjs/common';
import { AiReviewSummaryService } from '#aiReviewSummary/aiReviewSummary.service.js';
import { ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger';
import { AiReviewSummaryResponseDTO } from './types/aiReviewSummary.dto.js';

@Controller('reviewSummary')
export class AiReviewSummaryController {
  constructor(private readonly aiReviewSummaryService: AiReviewSummaryService) {}

  @Get(':driverId')
  @ApiOperation({ summary: '기사의 요약된 AI리뷰 조회' })
  @ApiParam({ name: 'driverId', description: '기사 ID', type: 'string' })
  @ApiResponse({
    status: HttpStatus.OK,
    type: AiReviewSummaryResponseDTO,
  })
  async getAiReviewSummary(@Param('driverId') driverId: string) {
    return this.aiReviewSummaryService.getAiReviewSummary(driverId);
  }

  @Post(':driverId')
  @ApiOperation({ summary: '기사의 AI리뷰 생성/업데이트' })
  @ApiParam({ name: 'driverId', description: '기사 ID', type: 'string' })
  @ApiResponse({
    status: HttpStatus.OK,
    type: AiReviewSummaryResponseDTO,
  })
  async generateAiReviewSummary(@Param('driverId') driverId: string) {
    return this.aiReviewSummaryService.generateAiReviewSummary(driverId);
  }
}

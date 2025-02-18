import { Controller, Get, HttpStatus, Param, Post } from '@nestjs/common';
import { ReviewKeywordsService } from './reviewKeywords.service.js';
import { IReviewKeywordsController } from './interfaces/reviewKeywords.controller.interface.js';
import { ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger';
import { AnalyzeAiReviewKeywordsDTO, ReviewKeywordsDTO } from './types/reviewKeywords.dto.js';

@Controller('reviewKeywords')
export class ReviewKeywordsController implements IReviewKeywordsController {
  constructor(private readonly reviewKeywordsService: ReviewKeywordsService) {}

  @Get(':driverId')
  @ApiOperation({ summary: '기사의 리뷰 키워드 조회' })
  @ApiParam({ name: 'driverId', description: '기사 ID', type: 'string' })
  @ApiResponse({
    status: HttpStatus.OK,
    type: ReviewKeywordsDTO,
  })
  async getReviewKeywords(@Param('driverId') driverId: string) {
    return this.reviewKeywordsService.findByDriverId(driverId);
  }

  @Post(':driverId')
  @ApiOperation({ summary: '기사의 리뷰 키워드 생성/업데이트' })
  @ApiParam({ name: 'driverId', description: '기사 ID', type: 'string' })
  @ApiResponse({
    status: HttpStatus.OK,
    type: AnalyzeAiReviewKeywordsDTO,
  })
  async analyzeAiReviewKeywords(@Param('driverId') driverId: string) {
    return this.reviewKeywordsService.analyzeAiReviewKeywords(driverId);
  }
}

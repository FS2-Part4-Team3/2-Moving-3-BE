import { Controller, Get, HttpStatus, Param, Post, Query } from '@nestjs/common';
import { ReviewKeywordsService } from './reviewKeywords.service.js';
import { IReviewKeywordsController } from './interfaces/reviewKeywords.controller.interface.js';
import { ApiOperation, ApiParam, ApiQuery, ApiResponse } from '@nestjs/swagger';
import { AnalyzeAiReviewKeywordsDTO, ReviewKeywordsResponseDTO } from './types/reviewKeywords.dto.js';
import { ReviewKeywordsGetQueries } from '#types/queries.type.js';
import { ReviewKeywordsFilter } from '#types/options.type.js';

@Controller('reviewKeywords')
export class ReviewKeywordsController implements IReviewKeywordsController {
  constructor(private readonly reviewKeywordsService: ReviewKeywordsService) {}

  @Get(':driverId')
  @ApiOperation({ summary: '기사의 리뷰 키워드 조회' })
  @ApiParam({ name: 'driverId', description: '기사 ID', type: 'string' })
  @ApiQuery({ name: 'filter', required: false, enum: ReviewKeywordsFilter })
  @ApiResponse({
    status: HttpStatus.OK,
    type: ReviewKeywordsResponseDTO,
  })
  async getReviewKeywords(@Param('driverId') driverId: string, @Query() query: ReviewKeywordsGetQueries) {
    const options = { filter: query.filter };

    return this.reviewKeywordsService.findByDriverId(driverId, options);
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

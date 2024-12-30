import { IReviewController } from '#reviews/interfaces/review.controller.interface.js';
import { Controller, Delete, Get, Post } from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';

@Controller('reviews')
export class ReviewController implements IReviewController {
  constructor() {}

  @Get(':driverId')
  @ApiOperation({ summary: '기사 리뷰 조회' })
  async getReviews() {}

  @Post(':driverId')
  @ApiOperation({ summary: '리뷰 생성' })
  async postReview() {}

  @Post(':reviewId')
  @ApiOperation({ summary: '리뷰 수정' })
  async patchReview() {}

  @Delete(':reviewId')
  @ApiOperation({ summary: '리뷰 삭제' })
  async deleteReview() {}
}

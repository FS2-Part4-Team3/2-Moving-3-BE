import { AccessTokenGuard } from '#guards/access-token.guard.js';
import { IReviewController } from '#reviews/interfaces/review.controller.interface.js';
import { Body, Controller, Delete, Get, Param, Post, UseGuards } from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';
import { ReviewService } from './review.service.js';
import { ReviewInputDTO } from './review.types.js';

@Controller('reviews')
export class ReviewController implements IReviewController {
  constructor(private readonly reviewService: ReviewService) {}

  @Get(':driverId')
  @ApiOperation({ summary: '기사 리뷰 조회' })
  async getReviews() {}

  @Post(':driverId')
  @UseGuards(AccessTokenGuard)
  @ApiOperation({ summary: '리뷰 생성' })
  async postReview(@Param('driverId') driverId: string, @Body() body: ReviewInputDTO) {
    const review = await this.reviewService.postReview(driverId, body);

    return review;
  }

  @Post('patch/:reviewId')
  @UseGuards(AccessTokenGuard)
  @ApiOperation({ summary: '리뷰 수정' })
  async patchReview(@Param('reviewId') reviewId: string, @Body() body: Partial<ReviewInputDTO>) {
    const review = await this.reviewService.patchReview(reviewId, body);

    return review;
  }

  @Delete(':reviewId')
  @ApiOperation({ summary: '리뷰 삭제' })
  async deleteReview() {}
}

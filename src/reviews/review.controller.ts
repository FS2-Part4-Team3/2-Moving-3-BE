import { AccessTokenGuard } from '#guards/access-token.guard.js';
import { IReviewController } from '#reviews/interfaces/review.controller.interface.js';
import { Body, Controller, Delete, Get, Param, Post, Query, UseGuards } from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';
import { ReviewService } from './review.service.js';
import { ReviewInputDTO } from './review.types.js';
import { GetQueries } from '#types/queries.type.js';
import { SortOrder } from '#types/options.type.js';

@Controller('reviews')
export class ReviewController implements IReviewController {
  constructor(private readonly reviewService: ReviewService) {}

  @Get(':driverId')
  @UseGuards(AccessTokenGuard)
  @ApiOperation({ summary: '기사 리뷰 조회' })
  async getDriverReviews(@Param('driverId') driverId: string, @Query() query: GetQueries) {
    const { page = 1, pageSize = 10, orderBy = SortOrder.Recent, keyword = '' } = query;
    const options = { page, pageSize, orderBy, keyword };

    const { totalCount, list } = await this.reviewService.getDriverReviews(driverId, options);

    return { totalCount, list };
  }

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
  @UseGuards(AccessTokenGuard)
  @ApiOperation({ summary: '리뷰 삭제' })
  async deleteReview(@Param('reviewId') reviewId: string) {
    const review = await this.reviewService.deleteReview(reviewId);

    return review;
  }
}

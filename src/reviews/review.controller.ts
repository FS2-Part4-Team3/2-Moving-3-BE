import { AccessTokenGuard } from '#guards/access-token.guard.js';
import { IReviewController } from '#reviews/interfaces/review.controller.interface.js';
import { Body, Controller, Delete, Get, HttpStatus, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger';
import { ReviewService } from './review.service.js';
import { DriverReviewResponseDTO, MyReviewResponseDTO, ReviewBodyDTO, ReviewInputDTO, ReviewOutputDTO } from './review.types.js';
import { GetQueries } from '#types/queries.type.js';
import { SortOrder } from '#types/options.type.js';

@Controller('reviews')
export class ReviewController implements IReviewController {
  constructor(private readonly reviewService: ReviewService) {}

  @Get('my')
  @UseGuards(AccessTokenGuard)
  @ApiBearerAuth('accessToken')
  @ApiOperation({ summary: '내가 작성한 리뷰 조회' })
  @ApiResponse({
    status: HttpStatus.OK,
    type: MyReviewResponseDTO,
  })
  async getMyReviews(@Query() query: GetQueries) {
    const { page = 1, pageSize = 10, orderBy = SortOrder.Recent, keyword = '' } = query;
    const options = { page, pageSize, orderBy, keyword };

    const { totalCount, list } = await this.reviewService.getMyReviews(options);

    return { totalCount, list };
  }

  @Get(':driverId')
  @ApiOperation({ summary: '기사 리뷰 조회' })
  @ApiParam({ name: 'driverId', description: '기사 ID', type: 'string' })
  @ApiResponse({
    status: HttpStatus.OK,
    type: DriverReviewResponseDTO,
  })
  async getDriverReviews(@Param('driverId') driverId: string, @Query() query: GetQueries) {
    const { page = 1, pageSize = 10, orderBy = SortOrder.Recent, keyword = '' } = query;
    const options = { page, pageSize, orderBy, keyword };

    const { totalCount, list } = await this.reviewService.getDriverReviews(driverId, options);

    return { totalCount, list };
  }

  @Post(':estimationId')
  @UseGuards(AccessTokenGuard)
  @ApiBearerAuth('accessToken')
  @ApiOperation({ summary: '리뷰 생성' })
  @ApiParam({ name: 'estimationId', description: '견적 ID', type: 'string' })
  @ApiBody({ type: ReviewBodyDTO })
  @ApiResponse({
    status: HttpStatus.CREATED,
    type: ReviewOutputDTO,
  })
  async postReview(@Param('estimationId') estimationId: string, @Body() body: ReviewInputDTO) {
    const review = await this.reviewService.postReview(estimationId, body);

    return review;
  }

  @Patch(':reviewId')
  @UseGuards(AccessTokenGuard)
  @ApiBearerAuth('accessToken')
  @ApiOperation({ summary: '리뷰 수정' })
  @ApiParam({ name: 'reviewId', description: '리뷰 ID', type: 'string' })
  @ApiBody({ type: ReviewBodyDTO })
  @ApiResponse({
    status: HttpStatus.OK,
    type: ReviewOutputDTO,
  })
  async patchReview(@Param('reviewId') reviewId: string, @Body() body: Partial<ReviewInputDTO>) {
    const review = await this.reviewService.patchReview(reviewId, body);

    return review;
  }

  @Delete(':reviewId')
  @UseGuards(AccessTokenGuard)
  @ApiBearerAuth('accessToken')
  @ApiOperation({ summary: '리뷰 삭제' })
  @ApiParam({ name: 'reviewId', description: '리뷰 ID', type: 'string' })
  @ApiResponse({
    status: HttpStatus.OK,
    type: ReviewOutputDTO,
  })
  async deleteReview(@Param('reviewId') reviewId: string) {
    const review = await this.reviewService.deleteReview(reviewId);

    return review;
  }
}

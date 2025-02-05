import { DriverService } from '#drivers/driver.service.js';
import { EstimationService } from '#estimations/estimation.service.js';
import {
  EstimationInputDTO,
  EstimationOutputDTO,
  ReviewableListDTO,
  ReviewableListResponseDTO,
  UserEstimationListWithCountDTO,
} from '#estimations/estimation.types.js';
import { IEstimationController } from '#estimations/interfaces/estimation.controller.interface.js';
import { AccessTokenGuard } from '#guards/access-token.guard.js';
import { QuestionService } from '#questions/question.service.js';
import { QuestionListDTO, QuestionPostDTO } from '#questions/types/question.dto.js';
import { QuestionEntity } from '#questions/types/question.types.js';
import { SortOrder } from '#types/options.type.js';
import { EstimationGetQueries, GetQueries, ReviewableGetQueries } from '#types/queries.type.js';
import { ApiBearerAuth, ApiOperation, ApiParam, ApiResponse, ApiTags, getSchemaPath } from '@nestjs/swagger';
import { Body, Controller, Get, HttpCode, HttpStatus, Param, Post, Query, UseGuards, ValidationPipe } from '@nestjs/common';

@Controller('estimations')
export class EstimationController implements IEstimationController {
  constructor(
    private readonly questionService: QuestionService,
    private readonly estimationService: EstimationService,
  ) {}

  @Get('user')
  @UseGuards(AccessTokenGuard)
  @ApiBearerAuth('accessToken')
  @ApiOperation({ summary: '유저 - 견적 대기중 목록 조회' })
  @ApiResponse({
    status: HttpStatus.OK,
    type: UserEstimationListWithCountDTO,
  })
  async getUserEstimations(@Query() query: EstimationGetQueries) {
    const { page = 1, pageSize = 10 } = query;
    const options = { page, pageSize };

    const result = await this.estimationService.getUserEstimationList(options);

    return result;
  }

  @Get('reviewable')
  @UseGuards(AccessTokenGuard)
  @ApiBearerAuth('accessToken')
  @ApiOperation({ summary: '작성 가능한 리뷰 목록 조회' })
  @ApiResponse({
    status: HttpStatus.OK,
    type: ReviewableListResponseDTO,
  })
  async getReviewableEstimations(@Query() query: ReviewableGetQueries) {
    const { page = 1, pageSize = 10 } = query;
    const options = { page, pageSize };
    const { estimations, totalCount } = await this.estimationService.getReviewableEstimations(options);
    return {
      estimations,
      totalCount,
    };
  }

  @Post(':moveInfoId')
  @UseGuards(AccessTokenGuard)
  @ApiBearerAuth('accessToken')
  @ApiOperation({ summary: '견적 생성 및 반려' })
  @ApiParam({ name: 'moveInfoId', description: '이사 정보 ID', type: 'string' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    type: EstimationOutputDTO,
  })
  async createEstimation(
    @Param('moveInfoId') moveInfoId: string,
    @Body() body: EstimationInputDTO,
    @Query('reject', new ValidationPipe({ transform: true })) reject: boolean = false,
  ) {
    const estimation = await this.estimationService.createEstimation(moveInfoId, body, reject);
    return estimation;
  }

  @ApiTags('Question')
  @Get(':id/questions')
  @UseGuards(AccessTokenGuard)
  @ApiBearerAuth('accessToken')
  @ApiOperation({ summary: '문의 목록 조회' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    type: QuestionListDTO,
  })
  async getQuestions(@Param('id') id: string, @Query() query: GetQueries) {
    const { page = 1, pageSize = 10 } = query;
    const options = { page, pageSize, orderBy: SortOrder.Latest, keyword: '' };

    const questions = await this.questionService.findQuestions(id, options);

    return questions;
  }

  @ApiTags('Question')
  @Post(':id/questions')
  @UseGuards(AccessTokenGuard)
  @ApiBearerAuth('accessToken')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: '문의 생성' })
  @ApiResponse({ status: HttpStatus.CREATED, type: QuestionEntity })
  async postQuestion(@Param('id') id: string, @Body() body: QuestionPostDTO) {
    const question = await this.questionService.createQuestion(id, body);

    return question;
  }
}

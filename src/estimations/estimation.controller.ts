import { IEstimationController } from '#estimations/interfaces/estimation.controller.interface.js';
import { AccessTokenGuard } from '#guards/access-token.guard.js';
import { QuestionService } from '#questions/question.service.js';
import { QuestionEntity, QuestionPostDTO } from '#questions/question.types.js';
import { SortOrder } from '#types/options.type.js';
import { GetQueries } from '#types/queries.type.js';
import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags, getSchemaPath } from '@nestjs/swagger';

@Controller('estimations')
export class EstimationController implements IEstimationController {
  constructor(private readonly questionService: QuestionService) {}

  @Get()
  @ApiOperation({ summary: '견적 목록 조회' })
  async getEstimations() {}

  @Get(':id')
  @ApiOperation({ summary: '견적 상세 조회' })
  async getEstimation() {}

  @Post(':moveInfoId')
  @ApiOperation({ summary: '견적 생성' })
  async postEstimation() {}

  @Post(':id')
  @ApiOperation({ summary: '견적 수정' })
  async patchEstimation() {}

  @Delete(':id')
  @ApiOperation({ summary: '견적 삭제' })
  async deleteEstimation() {}

  @ApiTags('Question')
  @Get(':id/questions')
  @UseGuards(AccessTokenGuard)
  @ApiBearerAuth('accessToken')
  @ApiOperation({ summary: '문의 목록 조회' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    schema: {
      type: 'array',
      items: { $ref: getSchemaPath(QuestionEntity) },
    },
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

import { IEstimationController } from '#estimations/interfaces/estimation.controller.interface.js';
import { QuestionService } from '#questions/question.service.js';
import { QuestionInputDTO } from '#questions/question.types.js';
import { GetQueries } from '#types/queries.type.js';
import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Post, Query } from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';

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

  @Get(':id/questions')
  @ApiOperation({ summary: '문의 목록 조회' })
  async getQuestions(@Param('id') id: string, @Query() query: GetQueries) {
    const { page = 1, pageSize = 10 } = query;
    const options = { page, pageSize, orderBy: 'latest', keyword: '' };

    const questions = await this.questionService.findQuestions(id, options);

    return questions;
  }

  @Post(':id/questions')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: '문의 생성' })
  async postQuestion(@Param('id') id: string, @Body() body: QuestionInputDTO) {
    const question = await this.questionService.createQuestion(id, body);

    return question;
  }
}

import { IQuestionController } from '#questions/interfaces/question.controller.interface.js';
import { QuestionService } from '#questions/question.service.js';
import { GetQueries } from '#types/queries.type.js';
import { Controller, Delete, Get, Param, Post, Query } from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';

@Controller('questions')
export class QuestionController implements IQuestionController {
  constructor(private readonly questionService: QuestionService) {}

  @Get(':estimationId')
  @ApiOperation({ summary: '문의 목록 조회' })
  async getQuestions(@Param('estimationId') estimationId: string, @Query() query: GetQueries) {
    const { page = 1, pageSize = 10 } = query;
    const options = { page, pageSize, orderBy: 'latest', keyword: '' };

    const questions = await this.questionService.findQuestions(estimationId, options);

    return questions;
  }

  @Get(':id')
  @ApiOperation({ summary: '문의 상세 조회' })
  async getQuestion() {}

  @Post(':moveInfoId')
  @ApiOperation({ summary: '문의 생성' })
  async postQuestion() {}

  @Post(':id')
  @ApiOperation({ summary: '문의 수정' })
  async patchQuestion() {}

  @Delete(':id')
  @ApiOperation({ summary: '문의 삭제' })
  async deleteQuestion() {}
}

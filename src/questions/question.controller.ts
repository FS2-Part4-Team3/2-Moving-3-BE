import { IQuestionController } from '#questions/interfaces/question.controller.interface.js';
import { Controller, Delete, Get, Post } from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';

@Controller('questions')
export class QuestionController implements IQuestionController {
  constructor() {}

  @Get()
  @ApiOperation({ summary: '문의 목록 조회' })
  async getQuestions() {}

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

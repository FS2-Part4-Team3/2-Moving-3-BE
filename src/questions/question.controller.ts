import { IQuestionController } from '#questions/interfaces/question.controller.interface.js';
import { QuestionService } from '#questions/question.service.js';
import { QuestionInputDTO } from '#questions/question.types.js';
import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';

@Controller('questions')
export class QuestionController implements IQuestionController {
  constructor(private readonly questionService: QuestionService) {}

  @Get(':id')
  @ApiOperation({ summary: '문의 상세 조회' })
  async getQuestion(@Param('id') id: string) {
    const question = await this.questionService.findQuestion(id);

    return question;
  }

  @Post(':id')
  @ApiOperation({ summary: '문의 수정' })
  async patchQuestion(@Param('id') id: string, @Body() body: Partial<QuestionInputDTO>) {
    const question = await this.questionService.updateQuestion(id, body);

    return question;
  }

  @Delete(':id')
  @ApiOperation({ summary: '문의 삭제' })
  async deleteQuestion() {}
}

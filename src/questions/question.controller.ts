import { AccessTokenGuard } from '#guards/access-token.guard.js';
import { IQuestionController } from '#questions/interfaces/question.controller.interface.js';
import { QuestionService } from '#questions/question.service.js';
import { QuestionPatchDTO } from '#questions/question.types.js';
import { Body, Controller, Delete, Get, Param, Patch, UseGuards } from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';

@Controller('questions')
export class QuestionController implements IQuestionController {
  constructor(private readonly questionService: QuestionService) {}

  @Get(':id')
  @UseGuards(AccessTokenGuard)
  @ApiOperation({ summary: '문의 상세 조회' })
  async getQuestion(@Param('id') id: string) {
    const question = await this.questionService.findQuestion(id);

    return question;
  }

  @Patch(':id')
  @UseGuards(AccessTokenGuard)
  @ApiOperation({ summary: '문의 수정' })
  async patchQuestion(@Param('id') id: string, @Body() body: QuestionPatchDTO) {
    const question = await this.questionService.updateQuestion(id, body);

    return question;
  }

  @Delete(':id')
  @UseGuards(AccessTokenGuard)
  @ApiOperation({ summary: '문의 삭제' })
  async deleteQuestion(@Param('id') id: string) {
    const question = await this.questionService.deleteQuestion(id);

    return question;
  }
}

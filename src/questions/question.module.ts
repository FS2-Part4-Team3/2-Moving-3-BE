import { DBModule } from '#global/db.module.js';
import { QuestionController } from '#questions/question.controller.js';
import { QuestionRepository } from '#questions/question.repository.js';
import { QuestionService } from '#questions/question.service.js';
import { Module } from '@nestjs/common';

@Module({
  imports: [DBModule],
  controllers: [QuestionController],
  providers: [QuestionService, QuestionRepository],
  exports: [QuestionService],
})
export class QuestionModule {}

import { IQuestionService } from '#questions/interfaces/question.service.interface.js';
import { QuestionRepository } from '#questions/question.repository.js';
import { FindOptions } from '#types/options.type.js';
import { Injectable } from '@nestjs/common';

@Injectable()
export class QuestionService implements IQuestionService {
  constructor(private readonly questionRepository: QuestionRepository) {}

  async findQuestions(estimationId: string, options: FindOptions) {
    const questions = await this.questionRepository.findMany(estimationId, options);

    return questions;
  }
}

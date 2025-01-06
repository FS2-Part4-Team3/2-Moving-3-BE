import { IQuestionService } from '#questions/interfaces/question.service.interface.js';
import { QuestionNotFoundException } from '#questions/question.exception.js';
import { QuestionRepository } from '#questions/question.repository.js';
import { FindOptions } from '#types/options.type.js';
import { Injectable } from '@nestjs/common';

@Injectable()
export class QuestionService implements IQuestionService {
  constructor(private readonly questionRepository: QuestionRepository) {}

  async findQuestions(estimationId: string, options: FindOptions) {
    const list = await this.questionRepository.findMany(estimationId, options);
    const totalCount = await this.questionRepository.count(estimationId);

    return { totalCount, list };
  }

  async findQuestion(id: string) {
    const question = await this.questionRepository.findById(id);
    if (!question) throw new QuestionNotFoundException();

    return question;
  }
}

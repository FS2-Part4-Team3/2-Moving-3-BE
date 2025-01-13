import { EstimationNotFoundException } from '#estimations/estimation.exception.js';
import { EstimationRepository } from '#estimations/estimation.repository.js';
import { ForbiddenException } from '#exceptions/http.exception.js';
import { MoveRepository } from '#move/move.repository.js';
import { IQuestionService } from '#questions/interfaces/question.service.interface.js';
import { QuestionNotFoundException } from '#questions/question.exception.js';
import { QuestionRepository } from '#questions/question.repository.js';
import { QuestionInputDTO } from '#questions/question.types.js';
import { IStorage, UserType } from '#types/common.types.js';
import { FindOptions } from '#types/options.type.js';
import { Injectable } from '@nestjs/common';
import { AsyncLocalStorage } from 'async_hooks';

@Injectable()
export class QuestionService implements IQuestionService {
  constructor(
    private readonly questionRepository: QuestionRepository,
    private readonly moveRepository: MoveRepository,
    private readonly estimationRepository: EstimationRepository,
    private readonly als: AsyncLocalStorage<IStorage>,
  ) {}

  async findQuestions(estimationId: string, options: FindOptions) {
    const target = await this.estimationRepository.findById(estimationId);
    if (!target) {
      throw new EstimationNotFoundException();
    }

    const storage = this.als.getStore();
    if (storage.type === UserType.User) {
      const { userId } = storage;
      const { ownerId } = await this.moveRepository.findByMoveInfoId(target.moveInfoId);
      if (userId !== ownerId) {
        throw new ForbiddenException();
      }
    } else if (storage.type === UserType.Driver) {
      const { driverId } = storage;
      if (driverId !== target.driverId) {
        throw new ForbiddenException();
      }
    }

    const list = await this.questionRepository.findMany(estimationId, options);
    const totalCount = await this.questionRepository.count(estimationId);

    return { totalCount, list };
  }

  async findQuestion(id: string) {
    const question = await this.questionRepository.findById(id);
    if (!question) throw new QuestionNotFoundException();

    return question;
  }

  async createQuestion(estimationId: string, data: QuestionInputDTO) {
    const question = await this.questionRepository.create({ ...data, estimationId });

    return question;
  }

  async updateQuestion(id: string, data: Partial<QuestionInputDTO>) {
    const question = await this.questionRepository.update(id, data);

    return question;
  }

  async deleteQuestion(id: string) {
    const question = await this.questionRepository.delete(id);

    return question;
  }
}

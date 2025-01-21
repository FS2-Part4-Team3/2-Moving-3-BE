import { EstimationNotFoundException } from '#estimations/estimation.exception.js';
import { EstimationRepository } from '#estimations/estimation.repository.js';
import { Estimation } from '#estimations/estimation.types.js';
import { ForbiddenException } from '#exceptions/http.exception.js';
import { MoveRepository } from '#move/move.repository.js';
import { IQuestionService } from '#questions/interfaces/question.service.interface.js';
import { QuestionNotFoundException } from '#questions/question.exception.js';
import { QuestionRepository } from '#questions/question.repository.js';
import { QuestionCreateDTO, QuestionPatchDTO, QuestionPostDTO, QuestionUpdateDTO } from '#questions/question.types.js';
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

  private async isAuthorizedPerson(target: Estimation) {
    const storage = this.als.getStore();
    if (storage.type === UserType.User) {
      const { userId } = storage;
      const { ownerId } = await this.moveRepository.findByMoveInfoId(target.moveInfoId);
      if (userId !== ownerId) {
        return false;
      }
    } else if (storage.type === UserType.Driver) {
      const { driverId } = storage;
      if (driverId !== target.driverId) {
        return false;
      }
    }

    return true;
  }

  async findQuestions(estimationId: string, options: FindOptions) {
    const target = await this.estimationRepository.findById(estimationId);
    if (!target) {
      throw new EstimationNotFoundException();
    }

    if (!this.isAuthorizedPerson(target)) {
      throw new ForbiddenException();
    }

    const list = await this.questionRepository.findMany(estimationId, options);
    const totalCount = await this.questionRepository.count(estimationId);

    return { totalCount, list };
  }

  async findQuestion(id: string) {
    const question = await this.questionRepository.findById(id);
    if (!question) {
      throw new QuestionNotFoundException();
    }

    const estimation = await this.estimationRepository.findById(question.estimationId);
    if (!this.isAuthorizedPerson(estimation)) {
      throw new ForbiddenException();
    }

    return question;
  }

  async createQuestion(estimationId: string, body: QuestionPostDTO) {
    const target = await this.estimationRepository.findById(estimationId);
    if (!target) {
      throw new EstimationNotFoundException();
    }

    if (!this.isAuthorizedPerson(target)) {
      throw new ForbiddenException();
    }

    const { userId, driverId } = this.als.getStore();

    const data: QuestionCreateDTO = { ...body, estimationId, userId, driverId };
    const question = await this.questionRepository.create(data);

    return question;
  }

  async updateQuestion(id: string, body: QuestionPatchDTO) {
    const target = await this.questionRepository.findById(id);
    if (!target) {
      throw new QuestionNotFoundException();
    }

    const { userId, driverId } = this.als.getStore();
    if (userId && userId !== target.userId) {
      throw new ForbiddenException();
    }
    if (driverId && driverId !== target.driverId) {
      throw new ForbiddenException();
    }

    const data: QuestionUpdateDTO = body;
    const question = await this.questionRepository.update(id, data);

    return question;
  }

  async deleteQuestion(id: string) {
    const target = await this.questionRepository.findById(id);
    if (!target) {
      throw new QuestionNotFoundException();
    }

    const { userId, driverId } = this.als.getStore();
    if (userId && userId !== target.userId) {
      throw new ForbiddenException();
    }
    if (driverId && driverId !== target.driverId) {
      throw new ForbiddenException();
    }

    const question = await this.questionRepository.delete(id);

    return question;
  }
}

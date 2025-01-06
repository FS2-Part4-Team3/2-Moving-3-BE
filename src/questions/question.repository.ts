import { PrismaService } from '#global/prisma.service.js';
import { IQuestionRepository } from '#questions/interfaces/question.repository.interface.js';
import { QuestionInputDTO } from '#questions/question.types.js';
import { FindOptions } from '#types/options.type.js';
import { Injectable } from '@nestjs/common';

@Injectable()
export class QuestionRepository implements IQuestionRepository {
  private readonly question;
  constructor(private readonly prisma: PrismaService) {
    this.question = prisma.question;
  }

  async findMany(estimationId: string, options: FindOptions) {
    const { page, pageSize } = options;

    const questions = await this.question.findMany({
      where: { estimationId },
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * pageSize,
      take: pageSize,
    });

    return questions;
  }

  async findById(id: string) {}

  async create(data: QuestionInputDTO) {}

  async update(id: string, data: Partial<QuestionInputDTO>) {}

  async delete(id: string) {}
}

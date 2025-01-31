import { PrismaService } from '#global/prisma.service.js';
import { IQuestionRepository } from '#questions/interfaces/question.repository.interface.js';
import { QuestionCreateDTO, QuestionUpdateDTO } from '#questions/types/question.dto.js';
import { FindOptions } from '#types/options.type.js';
import { Injectable } from '@nestjs/common';

@Injectable()
export class QuestionRepository implements IQuestionRepository {
  private readonly question;
  constructor(private readonly prisma: PrismaService) {
    this.question = prisma.question;
  }

  async count(estimationId: string) {
    const count = await this.question.count({ where: { estimationId } });

    return count;
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

  async findById(id: string) {
    const question = await this.question.findUnique({ where: { id } });

    return question;
  }

  async create(data: QuestionCreateDTO) {
    const question = await this.question.create({ data });

    return question;
  }

  async update(id: string, data: QuestionUpdateDTO) {
    const question = await this.question.update({ where: { id }, data });

    return question;
  }

  async delete(id: string) {
    const question = await this.question.delete({ where: { id } });

    return question;
  }
}

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

  async findMany(options: FindOptions) {}

  async findById(id: string) {}

  async create(data: QuestionInputDTO) {}

  async update(id: string, data: Partial<QuestionInputDTO>) {}

  async delete(id: string) {}
}

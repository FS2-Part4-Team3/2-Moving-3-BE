import { FindOptions } from '#types/options.type.js';
import { QuestionInputDTO } from 'src/questions/question.types.js';

export interface IQuestionRepository {
  findMany: (estimationId: string, options: FindOptions) => void;
  findById: (id: string) => void;
  create: (data: QuestionInputDTO) => void;
  update: (id: string, data: Partial<QuestionInputDTO>) => void;
  delete: (id: string) => void;
}

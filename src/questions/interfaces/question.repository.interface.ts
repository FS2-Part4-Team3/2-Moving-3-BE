import { FindOptions } from '#types/options.type.js';
import { Question, QuestionInputDTO } from 'src/questions/question.types.js';

export interface IQuestionRepository {
  findMany: (estimationId: string, options: FindOptions) => Promise<Question[]>;
  findById: (id: string) => Promise<Question> | null;
  create: (data: QuestionInputDTO) => void;
  update: (id: string, data: Partial<QuestionInputDTO>) => void;
  delete: (id: string) => void;
}

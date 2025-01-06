import { FindOptions } from '#types/options.type.js';
import { Question, QuestionCreateDTO } from 'src/questions/question.types.js';

export interface IQuestionRepository {
  findMany: (estimationId: string, options: FindOptions) => Promise<Question[]>;
  findById: (id: string) => Promise<Question> | null;
  create: (data: QuestionCreateDTO) => void;
  update: (id: string, data: Partial<QuestionCreateDTO>) => void;
  delete: (id: string) => void;
}

import { QuestionCreateDTO, QuestionUpdateDTO } from '#questions/types/question.dto.js';
import { Question } from '#questions/types/question.types.js';
import { FindOptions } from '#types/options.type.js';

export interface IQuestionRepository {
  findMany: (estimationId: string, options: FindOptions) => Promise<Question[]>;
  findById: (id: string) => Promise<Question> | null;
  create: (data: QuestionCreateDTO) => Promise<Question>;
  update: (id: string, data: QuestionUpdateDTO) => Promise<Question>;
  delete: (id: string) => Promise<Question>;
}

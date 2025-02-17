import { QuestionCreateDTO, QuestionUpdateDTO } from '#questions/types/question.dto.js';
import { IQuestion } from '#questions/types/question.types.js';
import { FindOptions } from '#types/options.type.js';

export interface IQuestionRepository {
  findMany: (estimationId: string, options: FindOptions) => Promise<IQuestion[]>;
  findById: (id: string) => Promise<IQuestion> | null;
  create: (data: QuestionCreateDTO) => Promise<IQuestion>;
  update: (id: string, data: QuestionUpdateDTO) => Promise<IQuestion>;
  delete: (id: string) => Promise<IQuestion>;
}

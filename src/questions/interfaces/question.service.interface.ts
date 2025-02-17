import { QuestionPatchDTO, QuestionPostDTO } from '#questions/types/question.dto.js';
import { IQuestion } from '#questions/types/question.types.js';
import { FindOptions } from '#types/options.type.js';

export interface IQuestionService {
  findQuestions: (estimationId: string, options: FindOptions) => Promise<{ totalCount: number; list: IQuestion[] }>;
  findQuestion: (id: string) => Promise<IQuestion>;
  createQuestion: (estimationId: string, data: QuestionPostDTO) => Promise<IQuestion>;
  updateQuestion: (id: string, data: QuestionPatchDTO) => Promise<IQuestion>;
  deleteQuestion: (id: string) => Promise<IQuestion>;
}

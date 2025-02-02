import { QuestionPatchDTO, QuestionPostDTO } from '#questions/types/question.dto.js';
import { Question } from '#questions/types/question.types.js';
import { FindOptions } from '#types/options.type.js';

export interface IQuestionService {
  findQuestions: (estimationId: string, options: FindOptions) => Promise<{ totalCount: number; list: Question[] }>;
  findQuestion: (id: string) => Promise<Question>;
  createQuestion: (estimationId: string, data: QuestionPostDTO) => Promise<Question>;
  updateQuestion: (id: string, data: QuestionPatchDTO) => Promise<Question>;
  deleteQuestion: (id: string) => Promise<Question>;
}

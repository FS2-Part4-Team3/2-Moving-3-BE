import { Question, QuestionPostDTO } from '#questions/question.types.js';
import { FindOptions } from '#types/options.type.js';

export interface IQuestionService {
  findQuestions: (estimationId: string, options: FindOptions) => Promise<{ totalCount: number; list: Question[] }>;
  findQuestion: (id: string) => Promise<Question>;
  createQuestion: (estimationId: string, data: QuestionPostDTO) => Promise<Question>;
  updateQuestion: (id: string, data: Partial<QuestionPostDTO>) => Promise<Question>;
  deleteQuestion: (id: string) => Promise<Question>;
}

import { Question } from '#questions/question.types.js';
import { FindOptions } from '#types/options.type.js';

export interface IQuestionService {
  findQuestions: (estimationId: string, options: FindOptions) => Promise<{ totalCount: number; list: Question[] }>;
  findQuestion: (id: string) => Promise<Question>;
}

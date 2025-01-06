import { Question } from '#questions/question.types.js';
import { GetQueries } from '#types/queries.type.js';

export interface IQuestionController {
  getQuestions: (estimationId: string, query: GetQueries) => Promise<Question[]>;
}

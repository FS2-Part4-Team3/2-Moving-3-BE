import { Question } from '#questions/question.types.js';
import { GetQueries } from '#types/queries.type.js';

export interface IEstimationController {
  getQuestions: (id: string, query: GetQueries) => Promise<{ totalCount: number; list: Question[] }>;
}

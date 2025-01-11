import { Question, QuestionInputDTO } from '#questions/question.types.js';
import { GetQueries } from '#types/queries.type.js';

export interface IEstimationController {
  getQuestions: (id: string, query: GetQueries) => Promise<{ totalCount: number; list: Question[] }>;
  postQuestion: (id: string, body: QuestionInputDTO) => Promise<Question>;
}

import { Question, QuestionPostDTO } from '#questions/question.types.js';
import { GetQueries } from '#types/queries.type.js';
import { EstimationInputDTO } from '#estimations/estimation.types.js';

export interface IEstimationController {
  getQuestions: (id: string, query: GetQueries) => Promise<{ totalCount: number; list: Question[] }>;
  postQuestion: (id: string, body: QuestionPostDTO) => Promise<Question>;
  createEstimation(moveInfoId: string, body: EstimationInputDTO, reject?: boolean): Promise<any>;
}

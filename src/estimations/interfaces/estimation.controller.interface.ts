import { EstimationInputDTO } from '#estimations/estimation.types.js';
import { QuestionPostDTO } from '#questions/types/question.dto.js';
import { IQuestion } from '#questions/types/question.types.js';
import { GetQueries } from '#types/queries.type.js';

export interface IEstimationController {
  getQuestions: (id: string, query: GetQueries) => Promise<{ totalCount: number; list: IQuestion[] }>;
  postQuestion: (id: string, body: QuestionPostDTO) => Promise<IQuestion>;
  createEstimation(moveInfoId: string, body: EstimationInputDTO, reject?: boolean): Promise<any>;
}

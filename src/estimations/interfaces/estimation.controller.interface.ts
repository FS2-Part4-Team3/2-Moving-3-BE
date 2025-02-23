import {
  ConfirmedEstimationDTO,
  DriverEstimationDetailDTO,
  DriverEstimationsList,
  EstimationInputDTO,
  RejectedEstimationsListDTO,
  ReviewableListResponseDTO,
  UserEstimationDetailDTO,
  UserEstimationListWithCountDTO,
} from '#estimations/types/estimation.dto.js';
import { QuestionPostDTO } from '#questions/types/question.dto.js';
import { IQuestion } from '#questions/types/question.types.js';
import {
  DriverEstimationsGetQueries,
  DriverRejectedEstimations,
  EstimationGetQueries,
  GetQueries,
  ReviewableGetQueries,
} from '#types/queries.type.js';

export interface IEstimationController {
  getQuestions: (id: string, query: GetQueries) => Promise<{ totalCount: number; list: IQuestion[] }>;
  postQuestion: (id: string, body: QuestionPostDTO) => Promise<IQuestion>;
  createEstimation(moveInfoId: string, body: EstimationInputDTO, reject?: boolean): Promise<any>;
  getUserEstimations: (query: EstimationGetQueries) => Promise<UserEstimationListWithCountDTO>;
  getReviewableEstimations: (query: ReviewableGetQueries) => Promise<ReviewableListResponseDTO>;
  getUserEstimationDetail: (estimationId: string) => Promise<UserEstimationDetailDTO>;
  getDriverEstimations: (query: DriverEstimationsGetQueries) => Promise<DriverEstimationsList>;
  getRejectedRequests: (
    query: DriverRejectedEstimations,
  ) => Promise<{ estimations: RejectedEstimationsListDTO[]; totalCount: number }>;
  getDriverEstimationDetail: (estimationId: string) => Promise<DriverEstimationDetailDTO>;
  getConfirmedEstimation: (estimationId: string) => Promise<ConfirmedEstimationDTO>;
}

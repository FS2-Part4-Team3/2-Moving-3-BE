import {
  ConfirmedEstimationDTO,
  DriverEstimationDetailDTO,
  DriverEstimationsListDTO,
  RejectedEstimationsListDTO,
  ReviewableListDTO,
  UserEstimationDetailDTO,
  UserEstimationListWithCountDTO,
} from '#estimations/types/estimation.dto.js';
import { Estimation, EstimationInputDTO } from '#estimations/types/estimation.types.js';
import {
  DriverEstimationsGetQueries,
  DriverRejectedEstimations,
  EstimationGetQueries,
  ReviewableGetQueries,
} from '#types/queries.type.js';

export interface IEstimationService {
  createEstimation: (moveInfoId: string, data: EstimationInputDTO, reject?: boolean) => Promise<Estimation | { message: string }>;
  getUserEstimationList: (options: EstimationGetQueries) => Promise<UserEstimationListWithCountDTO>;
  getReviewableEstimations: (options: ReviewableGetQueries) => Promise<{ estimations: ReviewableListDTO[]; totalCount: number }>;
  getDriverEstimations: (
    options: DriverEstimationsGetQueries,
  ) => Promise<{ estimations: DriverEstimationsListDTO[]; totalCount: number }>;
  getUserEstimationDetail: (estimationId: string) => Promise<UserEstimationDetailDTO>;
  getDriverEstimationDetail: (estimationId: string) => Promise<DriverEstimationDetailDTO>;
  getRejectedEstimations: (
    options: DriverRejectedEstimations,
  ) => Promise<{ estimations: RejectedEstimationsListDTO[]; totalCount: number }>;
  getConfirmedEstimation: (estimationId: string) => Promise<ConfirmedEstimationDTO>;
}

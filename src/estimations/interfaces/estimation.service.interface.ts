import { Estimation, EstimationInputDTO } from '#estimations/types/estimation.types.js';

export interface IEstimationService {
  createEstimation: (moveInfoId: string, data: EstimationInputDTO, reject?: boolean) => Promise<Estimation | { message: string }>;
}

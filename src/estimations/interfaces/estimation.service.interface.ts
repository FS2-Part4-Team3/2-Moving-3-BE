import { Estimation, EstimationInputDTO } from '#estimations/estimation.types.js';

export interface IEstimationService {
  createEstimation: (moveInfoId: string, data: EstimationInputDTO, reject?: boolean) => Promise<Estimation | { message: string }>;
}

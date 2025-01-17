import { Estimation, EstimationInputDTO } from '#estimations/estimation.types.js';

export interface IEstimationService {
  createEstimation: (moveInfoId: string, data: EstimationInputDTO) => Promise<Estimation>;
}

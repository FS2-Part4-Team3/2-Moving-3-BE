import { EstimationInputDTO, EstimationOutputDTO } from '#estimations/types/estimation.dto.js';
import { FindOptions } from '#types/options.type.js';
import { Estimation } from '#estimations/types/estimation.types.js';

export interface IEstimationRepository {
  findMany: (options: FindOptions) => void;
  findById: (id: string) => Promise<Estimation> | null;
  create: (data: EstimationInputDTO) => void;
  findByMoveInfoId: (moveInfoId: string) => Promise<EstimationOutputDTO[]>;
}

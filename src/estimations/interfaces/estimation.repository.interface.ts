import { EstimationInputDTO } from '#estimations/estimation.types.js';
import { FindOptions } from '#types/options.type.js';

export interface IEstimationRepository {
  findMany: (options: FindOptions) => void;
  findById: (id: string) => void;
  create: (data: EstimationInputDTO) => void;
  update: (id: string, data: Partial<EstimationInputDTO>) => void;
  delete: (id: string) => void;
}

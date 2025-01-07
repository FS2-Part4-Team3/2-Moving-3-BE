import { Request, RequestInputDTO } from '#requests/request.types.js';
import { FindOptions } from '#types/options.type.js';

export interface IRequestRepository {
  findMany: (driverId: string, options: FindOptions) => Promise<Request[]>;
  findById: (id: string) => void;
  create: (data: RequestInputDTO) => void;
  update: (id: string, data: Partial<RequestInputDTO>) => void;
  delete: (id: string) => void;
}

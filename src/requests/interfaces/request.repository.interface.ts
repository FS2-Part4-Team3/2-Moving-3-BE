import { Request, RequestInputDTO } from '#requests/request.types.js';
import { FindOptions } from '#types/options.type.js';

export interface IRequestRepository {
  findMany: (options: FindOptions) => void;
  findById: (id: string) => Promise<Request>;
  create: (data: RequestInputDTO) => void;
  update: (id: string, data: Partial<RequestInputDTO>) => void;
  delete: (id: string) => void;
}

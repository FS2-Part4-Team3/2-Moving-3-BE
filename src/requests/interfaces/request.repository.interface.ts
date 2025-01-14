import { Request, RequestInputDTO } from '#requests/request.types.js';
import { FindOptions } from '#types/options.type.js';

export interface IRequestRepository {
  findMany: (options: FindOptions) => void;
  findById: (requestId: string) => Promise<Request>;
  create: (data: RequestInputDTO) => Promise<Request>;
  update: (id: string, data: Partial<RequestInputDTO>) => void;
  delete: (id: string) => Promise<Request>;
}

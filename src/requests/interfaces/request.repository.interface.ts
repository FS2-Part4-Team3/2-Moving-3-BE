import { MoveInfo } from '#move/move.types.js';
import { Request, RequestInputDTO } from '#requests/request.types.js';
import { FindOptions } from '#types/options.type.js';

export interface IRequestRepository {
  findmoveInfo: (userId: string) => Promise<MoveInfo[]>;
  findMany: (options: FindOptions) => void;
  findById: (id: string) => void;
  create: (data: RequestInputDTO) => Promise<Request>;
  update: (id: string, data: Partial<RequestInputDTO>) => void;
  delete: (id: string) => void;
}

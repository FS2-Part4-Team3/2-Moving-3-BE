import { BaseRequestOutputDTO, CreateRequestDTO, IRequest, PatchRequestDTO } from '#requests/request.types.js';

export interface IRequestRepository {
  findById: (requestId: string) => Promise<BaseRequestOutputDTO>;
  create: (data: CreateRequestDTO) => Promise<IRequest>;
  update: (id: string, data: PatchRequestDTO) => void;
  delete: (id: string) => Promise<IRequest>;
}

import { CreateRequestDTO, IRequest, PatchRequestDTO, RequestOutputDTO } from '#requests/request.types.js';

export interface IRequestRepository {
  findById: (requestId: string) => Promise<RequestOutputDTO>;
  create: (data: CreateRequestDTO) => Promise<IRequest>;
  update: (id: string, data: PatchRequestDTO) => void;
  delete: (id: string) => Promise<IRequest>;
}

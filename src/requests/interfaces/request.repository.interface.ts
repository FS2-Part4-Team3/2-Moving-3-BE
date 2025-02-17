import { BaseRequestOutputDTO, CreateRequestDTO, PatchRequestDTO } from '#requests/types/request.dto.js';

export interface IRequestRepository {
  findById: (requestId: string) => Promise<BaseRequestOutputDTO>;
  findByMoveInfoId: (moveInfoId: string) => Promise<BaseRequestOutputDTO[]>;
  create: (data: CreateRequestDTO) => Promise<BaseRequestOutputDTO>;
  update: (id: string, data: PatchRequestDTO) => Promise<BaseRequestOutputDTO>;
  delete: (id: string) => Promise<BaseRequestOutputDTO>;
}

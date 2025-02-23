import { UpdateResponse } from '#move/types/move.types.js';
import { BaseRequestOutputDTO, CreateRequestDTO, PatchRequestDTO } from '#requests/types/request.dto.js';
import { IsActivate } from '#types/options.type.js';

export interface IRequestRepository {
  findById: (requestId: string) => Promise<BaseRequestOutputDTO>;
  findByMoveInfoId: (moveInfoId: string) => Promise<BaseRequestOutputDTO[]>;
  create: (data: CreateRequestDTO) => Promise<BaseRequestOutputDTO>;
  update: (id: string, data: PatchRequestDTO) => Promise<BaseRequestOutputDTO>;
  delete: (id: string) => Promise<BaseRequestOutputDTO>;
  updateToRequestExpired: (moveInfoIds: string[]) => Promise<UpdateResponse>;
  findDesignatedStatus: (moveInfoId: string, driverId: string) => Promise<IsActivate>;
}

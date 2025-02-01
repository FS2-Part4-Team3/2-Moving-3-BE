import { filterCountDTO, MoveInfo, MoveInfoInputDTO, MoveInfoWithEstimationsDTO } from '#move/move.types.js';
import { EstimationsFilter } from '#types/options.type.js';
import { MoveInfoGetQueries } from '#types/queries.type.js';

export interface IMoveService {
  getMoveInfos: (options: MoveInfoGetQueries) => Promise<{ totalCount: number; counts: filterCountDTO; list: MoveInfo[] }>;
  getMoveInfo: (moveInfoId: string) => Promise<MoveInfo>;
  checkMoveInfoExistence: () => Promise<MoveInfo[]>;
  getReceivedEstimations: (filter: EstimationsFilter) => Promise<MoveInfoWithEstimationsDTO[]>;
  postMoveInfo: (moveData: MoveInfoInputDTO) => Promise<MoveInfo>;
  patchMoveInfo: (moveId: string, body: Partial<MoveInfoInputDTO>) => Promise<MoveInfo>;
}

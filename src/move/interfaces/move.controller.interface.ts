import { filterCountDTO, MoveInfo, MoveInfoInputDTO, MoveInfoWithEstimationsResponseDTO } from '#move/move.types.js';
import { MoveInfoGetQueries, moveInfoWithEstimationsGetQueries } from '#types/queries.type.js';

export interface IMoveController {
  getMoveInfos: (query: MoveInfoGetQueries) => Promise<{ totalCount: number; counts: filterCountDTO; list: MoveInfo[] }>;
  checkMoveInfoExistence: () => Promise<MoveInfo[]>;
  getReceivedEstimations: (query: moveInfoWithEstimationsGetQueries) => Promise<MoveInfoWithEstimationsResponseDTO>;
  getMoveInfo: (moveInfoId: string) => Promise<MoveInfo>;
  postMoveInfo: (moveData: MoveInfoInputDTO) => Promise<MoveInfo>;
  patchMoveInfo: (moveId: string, body: Partial<MoveInfoInputDTO>) => Promise<MoveInfo>;
}

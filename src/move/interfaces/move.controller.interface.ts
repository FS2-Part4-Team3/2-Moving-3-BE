import {
  filterCountDTO,
  IsMoveInfoEditableDTO,
  MoveInfo,
  MoveInfoIdDTO,
  MoveInfoInputDTO,
  MoveInfoWithEstimationsResponseDTO,
} from '#move/move.types.js';
import { MoveInfoGetQueries, moveInfoWithEstimationsGetQueries } from '#types/queries.type.js';

export interface IMoveController {
  getMoveInfos: (query: MoveInfoGetQueries) => Promise<{ totalCount: number; counts: filterCountDTO; list: MoveInfo[] }>;
  getUserMoveInfoId: () => Promise<MoveInfoIdDTO>;
  checkMoveInfoExistence: () => Promise<MoveInfo[]>;
  getReceivedEstimations: (query: moveInfoWithEstimationsGetQueries) => Promise<MoveInfoWithEstimationsResponseDTO>;
  getMoveInfo: (moveInfoId: string) => Promise<MoveInfo>;
  getIsMoveInfoEditable: (moveInfoId: string) => Promise<IsMoveInfoEditableDTO>;
  postMoveInfo: (moveData: MoveInfoInputDTO) => Promise<MoveInfo>;
  patchMoveInfo: (moveId: string, body: Partial<MoveInfoInputDTO>) => Promise<MoveInfo>;
}

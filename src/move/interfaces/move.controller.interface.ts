import {
  filterCountDTO,
  IsMoveInfoEditableDTO,
  MoveInfoIdDTO,
  MoveInfoWithEstimationsResponseDTO,
  MoveInputDTO,
  MovePatchInputDTO,
} from '#move/types/move.dto.js';
import { IMoveInfo } from '#move/types/move.types.js';
import { MoveInfoGetQueries, moveInfoWithEstimationsGetQueries } from '#types/queries.type.js';

export interface IMoveController {
  getMoveInfos: (query: MoveInfoGetQueries) => Promise<{ totalCount: number; counts: filterCountDTO; list: IMoveInfo[] }>;
  getUserMoveInfoId: () => Promise<MoveInfoIdDTO>;
  checkMoveInfoExistence: () => Promise<IMoveInfo[]>;
  getReceivedEstimations: (query: moveInfoWithEstimationsGetQueries) => Promise<MoveInfoWithEstimationsResponseDTO>;
  getMoveInfo: (moveInfoId: string) => Promise<IMoveInfo>;
  getIsMoveInfoEditable: (moveInfoId: string) => Promise<IsMoveInfoEditableDTO>;
  postMoveInfo: (moveData: MoveInputDTO) => Promise<IMoveInfo>;
  patchMoveInfo: (moveInfoId: string, body: MovePatchInputDTO) => Promise<IMoveInfo>;
  deleteMoveInfo: (moveInfoId: string) => Promise<IMoveInfo>;
}

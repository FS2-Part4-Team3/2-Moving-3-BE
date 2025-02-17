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

export interface IMoveService {
  getMoveInfos: (options: MoveInfoGetQueries) => Promise<{ totalCount: number; counts: filterCountDTO; list: IMoveInfo[] }>;
  getMoveInfo: (moveInfoId: string) => Promise<IMoveInfo>;
  getUserMoveInfoId: () => Promise<MoveInfoIdDTO>;
  checkMoveInfoExistence: () => Promise<IMoveInfo[]>;
  getIsMoveInfoEditable: (moveInfoId: string) => Promise<IsMoveInfoEditableDTO>;
  getReceivedEstimations: (options: moveInfoWithEstimationsGetQueries) => Promise<MoveInfoWithEstimationsResponseDTO>;
  postMoveInfo: (moveData: MoveInputDTO) => Promise<IMoveInfo>;
  patchMoveInfo: (moveInfoId: string, body: MovePatchInputDTO) => Promise<IMoveInfo>;
  softDeleteMoveInfo: (id: string) => Promise<IMoveInfo>;
  autoCompleteMoves: () => Promise<void>;
  confirmEstimation: (moveInfoId: string, estimationId: string) => Promise<void>;
}

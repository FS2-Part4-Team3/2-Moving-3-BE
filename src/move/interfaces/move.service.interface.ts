import {
  filterCountDTO,
  IsMoveInfoEditableDTO,
  MoveInfo,
  MoveInfoIdDTO,
  MoveInfoInputDTO,
  MoveInfoWithEstimationsDTO,
  MoveInfoWithEstimationsResponseDTO,
} from '#move/move.types.js';
import { MoveInfoGetQueries, moveInfoWithEstimationsGetQueries } from '#types/queries.type.js';

export interface IMoveService {
  getMoveInfos: (options: MoveInfoGetQueries) => Promise<{ totalCount: number; counts: filterCountDTO; list: MoveInfo[] }>;
  getMoveInfo: (moveInfoId: string) => Promise<MoveInfo>;
  getUserMoveInfoId: () => Promise<MoveInfoIdDTO>;
  checkMoveInfoExistence: () => Promise<MoveInfo[]>;
  getIsMoveInfoEditable: (moveInfoId: string) => Promise<IsMoveInfoEditableDTO>;
  getReceivedEstimations: (options: moveInfoWithEstimationsGetQueries) => Promise<MoveInfoWithEstimationsResponseDTO>;
  postMoveInfo: (moveData: MoveInfoInputDTO) => Promise<MoveInfo>;
  patchMoveInfo: (moveInfoId: string, body: Partial<MoveInfoInputDTO>) => Promise<MoveInfo>;
}

import { MoveInfo, MoveInfoInputDTO } from '#move/move.types.js';
import { MoveInfoGetQueries } from '#types/queries.type.js';

export interface IMoveController {
  getMoveInfos: (query: MoveInfoGetQueries) => Promise<{ totalCount: number; list: MoveInfo[] }>;
  getMoveInfo: (moveInfoId: string) => Promise<MoveInfo>;
  postMoveInfo: (moveData: MoveInfoInputDTO) => Promise<MoveInfo>;
}

import { MoveInfo, MoveInfoInputDTO } from '#move/move.types.js';
import { MoveInfoGetQueries } from '#types/queries.type.js';

export interface IMoveService {
  getMoveInfos: (options: MoveInfoGetQueries) => Promise<{ totalCount: number; list: MoveInfo[] }>;
  getMoveInfo: (moveInfoId: string) => Promise<MoveInfo>;
  postMoveInfo: (moveData: MoveInfoInputDTO) => Promise<MoveInfo>;
  patchMoveInfo: (moveId: string, body: Partial<MoveInfoInputDTO>) => Promise<MoveInfo>;
}

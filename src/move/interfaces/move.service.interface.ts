import { filterCountDTO, MoveInfo, MoveInfoInputDTO } from '#move/move.types.js';
import { MoveInfoGetQueries } from '#types/queries.type.js';

export interface IMoveService {
  getMoveInfos: (options: MoveInfoGetQueries) => Promise<{ totalCount: number; counts: filterCountDTO; list: MoveInfo[] }>;
  getMoveInfo: (moveInfoId: string) => Promise<MoveInfo>;
  checkMoveInfoExistence: () => Promise<MoveInfo[]>;
  postMoveInfo: (moveData: MoveInfoInputDTO) => Promise<MoveInfo>;
  patchMoveInfo: (moveId: string, body: Partial<MoveInfoInputDTO>) => Promise<MoveInfo>;
}

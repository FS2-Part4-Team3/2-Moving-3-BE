import { MoveInfo } from '#move/move.types.js';
import { FindOptions, RequestFilter } from '#types/options.type.js';

export interface IMoveController {
  getMoveInfos: (driverId?: string, options?: FindOptions & RequestFilter) => Promise<{ totalCount: number; list: MoveInfo[] }>;
  getMoveInfo: () => Promise<MoveInfo>;
}

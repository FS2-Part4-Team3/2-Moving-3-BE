import { MoveInfo } from '#move/move.types.js';
import { FindOptions, RequestFilter } from '#types/options.type.js';
import { GetQueries } from '#types/queries.type.js';

export interface IMoveService {
  getMoveInfos: (options: GetQueries & Partial<RequestFilter>) => Promise<{ totalCount: number; list: MoveInfo[] }>;
  getMoveInfo: () => Promise<MoveInfo>;
}

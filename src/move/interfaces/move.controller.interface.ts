import { FindOptions, RequestFilter } from '#types/options.type.js';
import { MoveInfo } from '@prisma/client';

export interface IMoveController {
  getMoveInfos: (driverId?: string, options?: FindOptions & RequestFilter) => Promise<{ totalCount: number; list: MoveInfo[] }>;
}

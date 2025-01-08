import { Request } from '#requests/request.types.js';
import { FindOptions, RequestFilter } from '#types/options.type.js';

export interface IMoveService {
  getMoveInfos: (driverId?: string, options?: FindOptions & RequestFilter) => Promise<{ totalCount: number; list: Request[] }>;
}

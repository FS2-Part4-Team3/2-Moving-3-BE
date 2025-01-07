import { Request } from '#requests/request.types.js';
import { FindOptions } from '#types/options.type.js';

export interface IRequestService {
  getRequestsForDriver: (driverId: string, options: FindOptions) => Promise<{ totalCount: number; list: Request[] }>;
}

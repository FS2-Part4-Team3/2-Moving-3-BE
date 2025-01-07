import { FindOptions } from '#types/options.type.js';

export interface IRequestController {
  getRequestsForDriver: (id: string, options: FindOptions) => Promise<{ totalCount: number; list: Request[] }>;
}

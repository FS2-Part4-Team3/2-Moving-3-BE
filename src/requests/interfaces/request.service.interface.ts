import { Request } from '#requests/request.types.js';

export interface IRequestService {
  getRequest: (id: string) => Promise<Request>;
}

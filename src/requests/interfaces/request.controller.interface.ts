import { Request } from '#requests/request.types.js';

export interface IRequestController {
  getRequest: (id: string) => Promise<Request>;
}

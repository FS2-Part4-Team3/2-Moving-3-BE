import { Request } from '#requests/request.types.js';

export interface IRequestController {
  getRequest: (requestId: string) => Promise<Request>;
  postRequest: (driverId: string) => Promise<Request>;
}

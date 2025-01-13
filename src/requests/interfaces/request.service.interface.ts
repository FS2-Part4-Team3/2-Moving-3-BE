import { Request } from '#requests/request.types.js';

export interface IRequestService {
  getRequest: (requestId: string) => Promise<Request>;
  postRequest: (driverId: string) => Promise<Request>;
  deleteRequest: (requestId: string) => Promise<Request>;
}

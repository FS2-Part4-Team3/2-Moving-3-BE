import { Request } from '#requests/request.types.js';

export interface IRequestService {
  getRequest: (id: string) => Promise<Request>;
  postRequest: (driverId: string) => Promise<Request>;
}

import { Request } from '#requests/request.types.js';

export interface IRequestService {
  postRequest: (driverId: string) => Promise<Request>;
}

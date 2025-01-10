import { Request } from '#requests/request.types.js';

export interface IRequestController {
  postRequest: (driverId: string) => Promise<Request>;
}

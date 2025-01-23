import { checkRequestOutputDTO, Request } from '#requests/request.types.js';

export interface IRequestService {
  getRequest: (requestId: string) => Promise<Request>;
  checkRequest: (driverId: string) => Promise<checkRequestOutputDTO>;
  postRequest: (driverId: string) => Promise<Request>;
  deleteRequest: (requestId: string) => Promise<Request>;
}

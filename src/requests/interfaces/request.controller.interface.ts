import { checkRequestOutputDTO, Request } from '#requests/request.types.js';

export interface IRequestController {
  checkRequest: (driverId: string) => Promise<checkRequestOutputDTO>;
  getRequest: (requestId: string) => Promise<Request>;
  postRequest: (driverId: string) => Promise<Request>;
  deleteRequest: (requestId: string) => Promise<Request>;
}

import { checkRequestOutputDTO, IRequest, RequestOutputDTO } from '#requests/request.types.js';

export interface IRequestController {
  checkRequest: (driverId: string) => Promise<checkRequestOutputDTO>;
  getRequest: (requestId: string) => Promise<RequestOutputDTO>;
  postRequest: (driverId: string) => Promise<IRequest>;
  deleteRequest: (requestId: string) => Promise<IRequest>;
}

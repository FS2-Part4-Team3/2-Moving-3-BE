import { checkRequestOutputDTO, IRequest, RequestOutputDTO } from '#requests/request.types.js';

export interface IRequestService {
  getRequest: (requestId: string) => Promise<RequestOutputDTO>;
  checkRequest: (driverId: string) => Promise<checkRequestOutputDTO>;
  postRequest: (driverId: string) => Promise<IRequest>;
  deleteRequest: (requestId: string) => Promise<IRequest>;
}

import { BaseRequestOutputDTO, checkRequestOutputDTO, RequestOutputDTO } from '#requests/types/request.dto.js';

export interface IRequestController {
  checkRequest: (driverId: string) => Promise<checkRequestOutputDTO>;
  getRequest: (requestId: string) => Promise<RequestOutputDTO>;
  postRequest: (driverId: string) => Promise<BaseRequestOutputDTO>;
  deleteRequest: (requestId: string) => Promise<BaseRequestOutputDTO>;
}

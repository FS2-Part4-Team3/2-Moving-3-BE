import { BaseRequestOutputDTO, checkRequestOutputDTO, RequestOutputDTO } from '#requests/types/request.dto.js';

export interface IRequestService {
  getRequest: (requestId: string) => Promise<RequestOutputDTO>;
  checkRequest: (driverId: string) => Promise<checkRequestOutputDTO>;
  postRequest: (driverId: string) => Promise<BaseRequestOutputDTO>;
  deleteRequest: (requestId: string) => Promise<BaseRequestOutputDTO>;
}

import { BaseRequestOutputDTO, CheckRequestOutputDTO, RequestOutputDTO } from '#requests/types/request.dto.js';

export interface IRequestController {
  checkRequest: (driverId: string) => Promise<CheckRequestOutputDTO>;
  getRequest: (requestId: string) => Promise<RequestOutputDTO>;
  postRequest: (driverId: string) => Promise<BaseRequestOutputDTO>;
  deleteRequest: (requestId: string) => Promise<BaseRequestOutputDTO>;
}

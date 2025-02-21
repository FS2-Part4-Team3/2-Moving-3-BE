import { BaseRequestOutputDTO, CheckRequestOutputDTO, RequestOutputDTO } from '#requests/types/request.dto.js';

export interface IRequestService {
  getRequest: (requestId: string) => Promise<RequestOutputDTO>;
  checkRequest: (driverId: string) => Promise<CheckRequestOutputDTO>;
  postRequest: (driverId: string) => Promise<BaseRequestOutputDTO>;
  deleteRequest: (requestId: string) => Promise<BaseRequestOutputDTO>;
}

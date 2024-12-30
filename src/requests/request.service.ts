import { IRequestService } from '#requests/interfaces/request.service.interface.js';
import { Injectable } from '@nestjs/common';

@Injectable()
export class RequestService implements IRequestService {
  constructor() {}
}

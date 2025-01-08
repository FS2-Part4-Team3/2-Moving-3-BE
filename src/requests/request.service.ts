import { IRequestService } from '#requests/interfaces/request.service.interface.js';
import { Injectable } from '@nestjs/common';
import { RequestRepository } from './request.repository.js';

@Injectable()
export class RequestService implements IRequestService {
  constructor(private readonly requestRepository: RequestRepository) {}
}

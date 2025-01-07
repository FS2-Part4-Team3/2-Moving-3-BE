import { IRequestService } from '#requests/interfaces/request.service.interface.js';
import { Injectable } from '@nestjs/common';
import { RequestRepository } from './request.repository.js';
import { FindOptions } from '#types/options.type.js';

@Injectable()
export class RequestService implements IRequestService {
  constructor(private readonly requestRepository: RequestRepository) {}

  async getRequestsForDriver(driverId: string, options: FindOptions) {
    const list = await this.requestRepository.findMany(driverId, options);
    const totalCount = await this.requestRepository.totalCount(driverId);

    return { totalCount, list };
  }
}

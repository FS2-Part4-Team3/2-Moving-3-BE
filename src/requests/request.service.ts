import { IRequestService } from '#requests/interfaces/request.service.interface.js';
import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { RequestRepository } from './request.repository.js';
import { AsyncLocalStorage } from 'async_hooks';
import { IStorage } from '#types/common.types.js';
import { Status } from '@prisma/client';

@Injectable()
export class RequestService implements IRequestService {
  constructor(
    private readonly requestRepository: RequestRepository,
    private readonly als: AsyncLocalStorage<IStorage>,
  ) {}

  async postRequest(driverId: string) {
    const { userId } = this.als.getStore();

    const moveInfo = await this.requestRepository.findmoveInfo(userId);

    if (!moveInfo || moveInfo.length === 0) {
      throw new BadRequestException('이사 정보가 없습니다.');
    }

    const data = { moveInfoId: moveInfo[0].id, status: 'PENDING' as Status, driverId: driverId };

    const request = await this.requestRepository.create(data);

    return request;
  }
}

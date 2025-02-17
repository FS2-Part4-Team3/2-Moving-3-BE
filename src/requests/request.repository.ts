import { PrismaService } from '#global/prisma.service.js';
import { IRequestRepository } from '#requests/interfaces/request.repository.interface.js';
import { Injectable } from '@nestjs/common';
import { CreateRequestDTO, PatchRequestDTO } from './types/request.dto.js';
import { UpdateResponse } from '#move/types/move.types.js';

@Injectable()
export class RequestRepository implements IRequestRepository {
  private readonly request;
  constructor(private readonly prisma: PrismaService) {
    this.request = prisma.request;
  }
  async findById(requestId: string) {
    const request = await this.request.findUnique({
      where: { id: requestId },
    });

    return request;
  }

  async findByMoveInfoId(moveInfoId: string) {
    const request = await this.request.findMany({
      where: { moveInfoId },
    });

    return request;
  }

  async create(data: CreateRequestDTO) {
    const request = await this.request.create({ data });

    return request;
  }

  async update(id: string, data: PatchRequestDTO) {
    return await this.request.update({ where: { id }, data });
  }

  async delete(id: string) {
    const request = await this.request.delete({ where: { id } });

    return request;
  }

  // 지정여부 확인하기 ( 리퀘스트 테이블에서 apply인거만 )
  async DesignatedRequest(moveInfoId: string, driverId: string): Promise<boolean> {
    const [{ exists }] = await this.prisma.$queryRaw<{ exists: boolean }[]>` SELECT EXISTS(
        SELECT 1
        FROM "Request" AS r
        LEFT JOIN "MoveInfo" AS m ON r."moveInfoId" = m.id
        LEFT JOIN "Driver" AS d ON r."driverId" = d.id
        WHERE r."moveInfoId" = ${moveInfoId}
        AND r."driverId" = ${driverId}
        AND r."status" IS NOT NULL
        )`;
    return exists;
  }

  //자동 만료 3
  async updateToRequestExpired(moveInfoIds: string[]): Promise<UpdateResponse> {
    if (moveInfoIds.length === 0) return { count: 0, success: false };

    const updatedRequests = await this.request.updateMany({
      where: {
        moveInfoId: { in: moveInfoIds },
      },
      data: { status: 'EXPIRED' },
    });

    return { count: updatedRequests.count, success: updatedRequests.count > 0 };
  }
}

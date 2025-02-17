import { PrismaService } from '#global/prisma.service.js';
import { IRequestRepository } from '#requests/interfaces/request.repository.interface.js';
import { CreateRequestDTO, PatchRequestDTO } from '#requests/request.types.js';
import { Injectable } from '@nestjs/common';

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

  // 자동 만료 기능
  async updateToRequestExpired() {
    return this.prisma.request.updateMany({
      where: {
        moveInfoId: {
          in: (
            await this.prisma.moveInfo.findMany({
              where: { progress: 'EXPIRED' },
              select: { id: true },
            })
          ).map(move => move.id), // EXPIRED 상태가 된 moveInfo ID 목록 추출
        },
      },
      data: { status: 'EXPIRED' },
    });
  }
}

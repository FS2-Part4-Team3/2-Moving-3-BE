import { PrismaService } from '#global/prisma.service.js';
import { IMoveRepository } from '#move/interfaces/move.repository.interface.js';
import { MoveInfoInputDTO } from '#move/move.types.js';
import { FindOptions } from '#types/options.type.js';
import { Injectable } from '@nestjs/common';
import { Progress } from '@prisma/client';

@Injectable()
export class MoveRepository implements IMoveRepository {
  private readonly moveInfo;
  constructor(private readonly prisma: PrismaService) {
    this.moveInfo = prisma.moveInfo;
  }

  async findMany(options: FindOptions) {}

  async findById(userId: string) {
    const moveInfo = await this.moveInfo.findMany({ where: { ownerId: userId, progress: Progress.OPEN } });

    return moveInfo;
  }

  async create(data: MoveInfoInputDTO) {}

  async update(id: string, data: Partial<MoveInfoInputDTO>) {}

  async delete(id: string) {}
}

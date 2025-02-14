import { IChatRepository } from '#chats/interfaces/chat.repository.interface.js';
import { ChatCreateDTO } from '#chats/types/chat.dto.js';
import { PrismaService } from '#global/prisma.service.js';
import { UserType } from '#types/common.types.js';
import { OffsetPaginationOptions } from '#types/options.type.js';
import { Injectable } from '@nestjs/common';

@Injectable()
export class ChatRepository implements IChatRepository {
  private readonly chat;
  constructor(private readonly prisma: PrismaService) {
    this.chat = prisma.chat;
  }

  countList(id: string, userType: UserType) {
    const where = userType === UserType.User ? { userId: id } : { driverId: id };

    return this.chat.count({ where });
  }

  countChats(userId: string, driverId: string) {
    return this.chat.count({
      where: {
        userId,
        driverId,
      },
    });
  }

  findList(id: string, userType: UserType, options: OffsetPaginationOptions) {
    const where = userType === UserType.User ? { userId: id } : { driverId: id };
    const { page, pageSize } = options;

    return this.chat.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      take: pageSize,
      skip: (page - 1) * pageSize,
    });
  }

  findChats(userId: string, driverId: string, options: OffsetPaginationOptions) {
    const { page, pageSize } = options;

    return this.chat.findMany({
      where: {
        userId,
        driverId,
      },
      orderBy: { createdAt: 'desc' },
      take: pageSize,
      skip: (page - 1) * pageSize,
    });
  }

  create(data: ChatCreateDTO) {
    return this.chat.create({ data });
  }
}

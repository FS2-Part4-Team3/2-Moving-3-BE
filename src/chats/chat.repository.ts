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

  async countList(id: string, userType: UserType) {
    const where = userType === UserType.User ? { userId: id } : { driverId: id };
    const distinctField = userType === UserType.User ? 'driverId' : 'userId';

    const uniqueIds = await this.chat.findMany({
      where,
      distinct: [distinctField],
      select: { [distinctField]: true },
    });

    return uniqueIds.length;
  }

  async countChats(userId: string, driverId: string) {
    return await this.chat.count({
      where: {
        userId,
        driverId,
      },
    });
  }

  async findList(id: string, userType: UserType, options: OffsetPaginationOptions) {
    const where = userType === UserType.User ? { userId: id } : { driverId: id };
    const distinctField = userType === UserType.User ? 'driverId' : 'userId';
    const { page, pageSize } = options;

    const uniqueIds = await this.chat.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      take: pageSize,
      skip: (page - 1) * pageSize,
      distinct: [distinctField],
      select: { [distinctField]: true },
    });

    return uniqueIds;
  }

  async findChats(userId: string, driverId: string, options: OffsetPaginationOptions) {
    const { page, pageSize } = options;

    return await this.chat.findMany({
      where: {
        userId,
        driverId,
      },
      orderBy: { createdAt: 'desc' },
      take: pageSize,
      skip: (page - 1) * pageSize,
    });
  }

  async create(data: ChatCreateDTO) {
    return await this.chat.create({ data });
  }

  async updateManyAsRead(userId: string, driverId: string, chatIds: string[], isRead: boolean) {
    const chats = this.chat.updateManyAndReturn({
      where: { id: { in: chatIds }, userId, driverId },
      data: { isRead },
    });

    return chats;
  }
}

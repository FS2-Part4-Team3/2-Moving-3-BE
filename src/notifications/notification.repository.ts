import { PrismaService } from '#global/prisma.service.js';
import { INotificationRepository } from '#notifications/interfaces/notification.repository.interface.js';
import { NotificationCreateDTO } from '#notifications/notification.types.js';
import { UserType } from '#types/common.types.js';
import { Injectable } from '@nestjs/common';

@Injectable()
export class NotificationRepository implements INotificationRepository {
  private readonly notification;
  constructor(private readonly prisma: PrismaService) {
    this.notification = prisma.notification;
  }

  async count(type: UserType, id: string) {
    const where = type === UserType.User ? { userId: id } : { driverId: id };
    console.log('🚀 ~ NotificationRepository ~ count ~ where:', where);

    const totalCount = await this.notification.count({ where });

    return totalCount;
  }

  async findMany(type: UserType, id: string, page: number, pageSize: number) {
    const where = type === UserType.User ? { userId: id } : { driverId: id };

    const notifications = await this.notification.findMany({
      where,
      orderBy: [{ isRead: 'asc' }, { createdAt: 'desc' }],
      skip: (page - 1) * pageSize,
      take: pageSize,
    });

    return notifications;
  }

  async findById() {}

  async create(data: NotificationCreateDTO) {
    const notification = await this.notification.create({ data });

    return notification;
  }

  async updateManyAsRead(type: UserType, id: string, notificationIds: string[]) {
    const where =
      type === UserType.User
        ? {
            id: { in: notificationIds },
            userId: id,
          }
        : {
            id: { in: notificationIds },
            driverId: id,
          };

    const notifications = this.notification.updateManyAndReturn({
      where,
      data: { isRead: true },
    });

    return notifications;
  }

  async delete() {}
}

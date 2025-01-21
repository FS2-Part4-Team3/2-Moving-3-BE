import { PrismaService } from '#global/prisma.service.js';
import { INotificationRepository } from '#notifications/interfaces/notification.repository.interface.js';
import { Injectable } from '@nestjs/common';

@Injectable()
export class NotificationRepository implements INotificationRepository {
  private readonly notification;
  constructor(private readonly prisma: PrismaService) {
    this.notification = prisma.notification;
  }

  async count() {}
  async findMany() {}
  async findById() {}

  async create(data: any) {
    const notification = await this.notification.create(data);

    return notification;
  }

  async update() {}
  async delete() {}
}

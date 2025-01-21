import { PrismaService } from '#global/prisma.service.js';
import { INotificationRepository } from '#notifications/interfaces/notification.repository.interface.js';

export class NotificationRepository implements INotificationRepository {
  private readonly notification;
  constructor(private readonly prisma: PrismaService) {
    this.notification = prisma.notification;
  }

  async count() {}
  async findMany() {}
  async findById() {}
}

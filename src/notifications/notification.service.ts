import { INotificationService } from '#notifications/interfaces/notification.service.interface.js';
import { NotificationGateway } from '#notifications/notification.gateway.js';
import { NotificationRepository } from '#notifications/notification.repository.js';
import { Injectable } from '@nestjs/common';

@Injectable()
export class NotificationService implements INotificationService {
  constructor(
    private readonly notificationRepository: NotificationRepository,
    private readonly notificationGateway: NotificationGateway,
  ) {}

  private isValidNotificationData(data: any) {
    if (data.userId && data.driverId) {
      return false;
    }

    return true;
  }

  // async createUserNotification(data) {
  //   if (!this.isValidNotificationData(data)) {
  //     throw new NotificationInvalidTargetException();
  //   }

  //   const { userId, type, message, estimationId, date } = data;
  //   const notification = await this.notificationRepository.create({
  //     data: {
  //       userId,
  //       type,
  //       message,
  //       estimationId,
  //       date,
  //       isRead: false,
  //     },
  //   });

  //   this.notificationGateway.sendToUser(userId, notification);
  //   return notification;
  // }

  // async createDriverNotification({
  //   driverId,
  //   type,
  //   message,
  //   requestId,
  //   estimationId,
  //   date,
  // }: {
  //   driverId: string;
  //   type: NotificationType;
  //   message: string;
  //   requestId?: string;
  //   estimationId?: string;
  //   date?: Date;
  // }) {
  //   const notification = await this.prisma.driverNotification.create({
  //     data: {
  //       driverId,
  //       type,
  //       message,
  //       requestId,
  //       estimationId,
  //       date,
  //       isRead: false,
  //     },
  //   });

  //   this.notificationGateway.sendToDriver(driverId, notification);
  //   return notification;
  // }
}

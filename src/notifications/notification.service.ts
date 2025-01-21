import { INotificationService } from '#notifications/interfaces/notification.service.interface.js';
import { NotificationRepository } from '#notifications/notification.repository.js';
import { Notification } from '#notifications/notification.types.js';

export class NotificationService implements INotificationService {
  constructor(private readonly notificationRepository: NotificationRepository) {}

  private isValidNotification(notification: Notification) {
    if (notification.targetUserId && notification.targetDriverId) {
      return false;
    }

    return true;
  }
}

import { Notification, NotificationCreateDTO } from '#notifications/notification.types.js';

export interface INotificationRepository {
  create: (data: NotificationCreateDTO) => Promise<Notification>;
}

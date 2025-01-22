import { Notification, NotificationCreateDTO } from '#notifications/notification.types.js';
import { UserType } from '#types/common.types.js';

export interface INotificationRepository {
  create: (data: NotificationCreateDTO) => Promise<Notification>;
  updateManyAsRead: (type: UserType, id: string, notificationIds: string[]) => Promise<Notification[]>;
}

import { NotificationCreateDTO } from '#notifications/types/notification.dto.js';
import { Notification } from '#notifications/types/notification.types.js';
import { UserType } from '#types/common.types.js';

export interface INotificationRepository {
  create: (data: NotificationCreateDTO) => Promise<Notification>;
  updateManyAsRead: (type: UserType, id: string, notificationIds: string[]) => Promise<Notification[]>;
}

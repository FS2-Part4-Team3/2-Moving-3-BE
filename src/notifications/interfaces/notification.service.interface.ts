import { NotificationCreateDTO } from '#notifications/types/notification.dto.js';
import { Notification } from '#notifications/types/notification.types.js';

export interface INotificationService {
  getNotifications: (page: number, pageSize: number) => Promise<{ totalCount: number; list: Notification[] }>;
  createNotification: (body: NotificationCreateDTO) => Promise<Notification>;
  markNotificationAsRead: (notificationIds: string[]) => Promise<Notification[]>;
}

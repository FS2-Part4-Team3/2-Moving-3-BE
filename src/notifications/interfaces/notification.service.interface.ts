import { NotificationCreateDTO } from '#notifications/types/notification.dto.js';
import { INotification } from '#notifications/types/notification.types.js';

export interface INotificationService {
  getNotifications: (page: number, pageSize: number) => Promise<{ totalCount: number; list: INotification[] }>;
  createNotification: (body: NotificationCreateDTO) => Promise<INotification>;
  markNotificationAsRead: (notificationIds: string[]) => Promise<INotification[]>;
}

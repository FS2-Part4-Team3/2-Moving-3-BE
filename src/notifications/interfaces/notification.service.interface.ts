import { Notification } from '#notifications/types/notification.types.js';

export interface INotificationService {
  getNotifications: (page: number, pageSize: number) => Promise<{ totalCount: number; list: Notification[] }>;
  createNotification: (body: any) => Promise<Notification>;
  markNotificationAsRead: (notificationIds: string[]) => Promise<Notification[]>;
}

import { Notification } from '#notifications/notification.types.js';

export interface INotificationService {
  createNotification: (body: any) => Promise<Notification>;
}

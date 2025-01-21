import { NotificationService } from '#notifications/notification.service.js';

export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}
}

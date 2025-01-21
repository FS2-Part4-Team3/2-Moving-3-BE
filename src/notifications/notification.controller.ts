import { NotificationService } from '#notifications/notification.service.js';
import { Controller } from '@nestjs/common';

@Controller('notification')
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}
}

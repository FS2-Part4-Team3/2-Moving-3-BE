import { NotificationController } from '#notifications/notification.controller.js';
import { NotificationRepository } from '#notifications/notification.repository.js';
import { NotificationService } from '#notifications/notification.service.js';
import { Module } from '@nestjs/common';

@Module({
  imports: [],
  controllers: [NotificationController],
  providers: [NotificationService, NotificationRepository],
  exports: [],
})
export class NotificationModule {}

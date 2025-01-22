import { DBModule } from '#global/db.module.js';
import { GuardModule } from '#guards/guard.module.js';
import { NotificationController } from '#notifications/notification.controller.js';
import { NotificationGateway } from '#notifications/notification.gateway.js';
import { NotificationRepository } from '#notifications/notification.repository.js';
import { NotificationService } from '#notifications/notification.service.js';
import { Module } from '@nestjs/common';

@Module({
  imports: [DBModule, GuardModule],
  controllers: [NotificationController],
  providers: [NotificationService, NotificationRepository, NotificationGateway],
  exports: [NotificationService],
})
export class NotificationModule {}

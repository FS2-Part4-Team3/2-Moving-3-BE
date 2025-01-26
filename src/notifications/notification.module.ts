import { DBModule } from '#global/db.module.js';
import { GuardModule } from '#guards/guard.module.js';
import { MoveModule } from '#move/move.module.js';
import { NotificationController } from '#notifications/notification.controller.js';
import { NotificationGateway } from '#notifications/notification.gateway.js';
import { NotificationRepository } from '#notifications/notification.repository.js';
import { NotificationScheduler } from '#notifications/notification.scheduler.js';
import { NotificationService } from '#notifications/notification.service.js';
import { Module } from '@nestjs/common';

@Module({
  imports: [DBModule, GuardModule, MoveModule],
  controllers: [NotificationController],
  providers: [NotificationService, NotificationRepository, NotificationGateway, NotificationScheduler],
  exports: [NotificationService],
})
export class NotificationModule {}

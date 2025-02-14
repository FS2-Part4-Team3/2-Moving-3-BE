import { DBModule } from '#global/db.module.js';
import { GuardModule } from '#guards/guard.module.js';
import { MoveModule } from '#move/move.module.js';
import { NotificationController } from '#notifications/notification.controller.js';
import { NotificationRepository } from '#notifications/notification.repository.js';
import { NotificationScheduler } from '#notifications/notification.scheduler.js';
import { NotificationService } from '#notifications/notification.service.js';
import { WebSocketModule } from '#websockets/websocket.module.js';
import { Module } from '@nestjs/common';

@Module({
  imports: [DBModule, GuardModule, MoveModule, WebSocketModule],
  controllers: [NotificationController],
  providers: [NotificationService, NotificationRepository, NotificationScheduler],
  exports: [NotificationService],
})
export class NotificationModule {}

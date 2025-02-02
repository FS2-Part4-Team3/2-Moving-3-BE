import { DriverModule } from '#drivers/driver.module.js';
import { DBModule } from '#global/db.module.js';
import { GuardModule } from '#guards/guard.module.js';
import { MoveController } from '#move/move.controller.js';
import { MoveRepository } from '#move/move.repository.js';
import { MoveService } from '#move/move.service.js';
import { Module } from '@nestjs/common';

@Module({
  imports: [DBModule, GuardModule, DriverModule],
  controllers: [MoveController],
  providers: [MoveService, MoveRepository],
  exports: [MoveRepository],
})
export class MoveModule {}

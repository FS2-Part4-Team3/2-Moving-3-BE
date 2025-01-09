import { AuthModule } from '#auth/auth.module.js';
import { DBModule } from '#global/db.module.js';
import { MoveController } from '#move/move.controller.js';
import { MoveRepository } from '#move/move.repository.js';
import { MoveService } from '#move/move.service.js';
import { Module } from '@nestjs/common';

@Module({
  imports: [DBModule, AuthModule],
  controllers: [MoveController],
  providers: [MoveService, MoveRepository],
  exports: [MoveRepository],
})
export class MoveModule {}

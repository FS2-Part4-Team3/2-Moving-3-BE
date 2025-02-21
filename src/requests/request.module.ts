import { EstimationModule } from '#estimations/estimation.module.js';
import { DBModule } from '#global/db.module.js';
import { GuardModule } from '#guards/guard.module.js';
import { MoveModule } from '#move/move.module.js';
import { RequestController } from '#requests/request.controller.js';
import { RequestRepository } from '#requests/request.repository.js';
import { RequestService } from '#requests/request.service.js';
import { forwardRef, Module } from '@nestjs/common';

@Module({
  imports: [DBModule, GuardModule, forwardRef(() => MoveModule), forwardRef(() => EstimationModule)],
  controllers: [RequestController],
  providers: [RequestService, RequestRepository],
  exports: [RequestRepository],
})
export class RequestModule {}

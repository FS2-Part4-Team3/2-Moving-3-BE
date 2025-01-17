import { EstimationController } from '#estimations/estimation.controller.js';
import { EstimationRepository } from '#estimations/estimation.repository.js';
import { EstimationService } from '#estimations/estimation.service.js';
import { DBModule } from '#global/db.module.js';
import { GuardModule } from '#guards/guard.module.js';
import { QuestionModule } from '#questions/question.module.js';
import { forwardRef, Module } from '@nestjs/common';

@Module({
  imports: [DBModule, GuardModule, forwardRef(() => QuestionModule)],
  controllers: [EstimationController],
  providers: [EstimationService, EstimationRepository],
  exports: [EstimationRepository],
})
export class EstimationModule {}

import { EstimationController } from '#estimations/estimation.controller.js';
import { EstimationRepository } from '#estimations/estimation.repository.js';
import { EstimationService } from '#estimations/estimation.service.js';
import { DBModule } from '#global/db.module.js';
import { QuestionModule } from '#questions/question.module.js';
import { Module } from '@nestjs/common';

@Module({
  imports: [DBModule, QuestionModule],
  controllers: [EstimationController],
  providers: [EstimationService, EstimationRepository],
})
export class EstimationModule {}

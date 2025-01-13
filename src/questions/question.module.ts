import { EstimationModule } from '#estimations/estimation.module.js';
import { DBModule } from '#global/db.module.js';
import { GuardModule } from '#guards/guard.module.js';
import { MoveModule } from '#move/move.module.js';
import { QuestionController } from '#questions/question.controller.js';
import { QuestionRepository } from '#questions/question.repository.js';
import { QuestionService } from '#questions/question.service.js';
import { forwardRef, Module } from '@nestjs/common';

@Module({
  imports: [DBModule, MoveModule, GuardModule, forwardRef(() => EstimationModule)],
  controllers: [QuestionController],
  providers: [QuestionService, QuestionRepository],
  exports: [QuestionService],
})
export class QuestionModule {}

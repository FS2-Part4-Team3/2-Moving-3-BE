import { Question, QuestionEntity } from '#questions/types/question.types.js';
import { ModelBase } from '#types/common.types.js';
import { OmitType, PartialType } from '@nestjs/swagger';

interface PersonIds {
  userId: string;
  driverId: string;
}

export class QuestionPostDTO extends OmitType(QuestionEntity, ['estimationId']) {}
export interface QuestionCreateDTO extends Omit<Question, keyof (ModelBase & PersonIds)> {
  userId?: string;
  driverId?: string;
}

export class QuestionPatchDTO extends PartialType(QuestionPostDTO) {}
export interface QuestionUpdateDTO extends Partial<QuestionCreateDTO> {}

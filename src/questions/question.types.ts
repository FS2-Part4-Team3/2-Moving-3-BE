import { ModelBase } from '#types/common.types.js';
import { OmitType, PartialType } from '@nestjs/swagger';
import { Question as PrismaQuestion } from '@prisma/client';
import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

interface PrismaQuestionBase extends Omit<PrismaQuestion, keyof ModelBase> {}
interface QuestionBase extends PrismaQuestionBase {}

export interface Question extends QuestionBase, ModelBase {}

export class QuestionEntity {
  @IsString({ message: '내용은 문자열 형식입니다.' })
  @IsNotEmpty({ message: '내용은 1글자 이상이어야 합니다.' })
  content: string;

  @IsUUID('all', { message: '견적 id는 uuid 형식이어야 합니다.' })
  estimationId: string;
}

interface PersonInfo {
  ownerId: string;
  driverId: string;
}

export interface QuestionCreateDTO extends Omit<Omit<Question, keyof ModelBase>, keyof PersonInfo> {
  ownerId?: string;
  driverId?: string;
}
export class QuestionPostDTO extends OmitType(QuestionEntity, ['estimationId']) {}

export class QuestionPatchDTO extends PartialType(OmitType(QuestionEntity, ['estimationId'])) {}
export interface QuestionUpdateDTO extends Partial<Omit<Question, keyof (ModelBase & PersonInfo)>> {}

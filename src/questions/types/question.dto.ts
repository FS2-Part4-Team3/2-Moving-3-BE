import { IQuestion, QuestionEntity } from '#questions/types/question.types.js';
import { ModelBase } from '#types/common.types.js';
import { ApiProperty, PartialType, PickType } from '@nestjs/swagger';

interface PersonIds {
  userId: string;
  driverId: string;
}

export class QuestionListDTO {
  @ApiProperty({ description: '문의 갯수' })
  totalCount: number;

  @ApiProperty({ description: '문의 목록', type: [QuestionEntity] })
  list: QuestionEntity[];
}

export class QuestionPostDTO extends PickType(QuestionEntity, ['content']) {}
export interface QuestionCreateDTO extends Omit<IQuestion, keyof (ModelBase & PersonIds)> {
  userId?: string;
  driverId?: string;
}

export class QuestionPatchDTO extends PartialType(QuestionPostDTO) {}
export interface QuestionUpdateDTO extends Partial<QuestionCreateDTO> {}

import { INotification } from '#notifications/types/notification.types.js';
import { ModelBase } from '#types/common.types.js';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

export interface IQuestion extends ModelBase {
  content: string;

  estimationId: string;
  userId?: string;
  driverId?: string;
  notifications?: INotification[];
}

export class QuestionEntity {
  @IsString({ message: '내용은 문자열 형식입니다.' })
  @IsNotEmpty({ message: '내용은 1글자 이상이어야 합니다.' })
  @ApiProperty({ description: '문의 내용' })
  content: string;

  @IsUUID('all', { message: '견적 id는 uuid 형식이어야 합니다.' })
  @ApiProperty({ description: '견적 ID' })
  estimationId: string;
}

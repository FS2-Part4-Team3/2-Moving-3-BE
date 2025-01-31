import { ModelBase } from '#types/common.types.js';
import { ApiProperty } from '@nestjs/swagger';
import { NotificationType } from '@prisma/client';

export interface NotificationCreateDTO extends Omit<Notification, keyof ModelBase> {}

export class NotificationOutputDTO {
  @ApiProperty({ description: '알림 타입' })
  type: NotificationType;

  @ApiProperty({ description: '알림 메세지' })
  message: string;

  @ApiProperty({ description: '읽음 여부' })
  isRead: boolean;

  @ApiProperty({ description: '유저 ID' })
  userId?: string;

  @ApiProperty({ description: '유저 이름' })
  user?: { name: string } | null;

  @ApiProperty({ description: '기사 ID' })
  driverId?: string;

  @ApiProperty({ description: '기사 이름' })
  driver?: { name: string } | null;

  @ApiProperty({ description: '이사 정보 ID' })
  moveInfoId?: string;

  @ApiProperty({ description: '요청 ID' })
  requestId?: string;

  @ApiProperty({ description: '견적 ID' })
  estimationId?: string;

  @ApiProperty({ description: '문의 ID' })
  questionId?: string;
}

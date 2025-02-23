import { INotification, NotificationType } from '#notifications/types/notification.types.js';
import { ModelBase } from '#types/common.types.js';
import { ApiProperty } from '@nestjs/swagger';

export class NotificationReadInputDTO {
  @ApiProperty({ description: '읽을 알림 ID 목록' })
  ids: string[];
}

export interface NotificationCreateDTO extends Partial<Omit<INotification, keyof ModelBase>> {
  type: NotificationType;
  message: string;
}

export class NotificationDTO {
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

export class NotificationOutputDTO {
  @ApiProperty({ description: '알림 내용' })
  data: NotificationDTO;

  @ApiProperty({ description: '알림 타입' })
  type: string;
}

export class NotificationListDTO {
  @ApiProperty({ description: '알림 갯수' })
  totalCount: number;

  @ApiProperty({ description: '알림 내용', type: [NotificationDTO] })
  list: NotificationDTO[];
}

import { ModelBase } from '#types/common.types.js';

export enum NotificationType {
  MOVE_INFO_EXPIRED = 'MOVE_INFO_EXPIRED',
  NEW_REQUEST = 'NEW_REQUEST',
  NEW_ESTIMATION = 'NEW_ESTIMATION',
  REQUEST_REJECTED = 'REQUEST_REJECTED',
  ESTIMATION_CONFIRMED = 'ESTIMATION_CONFIRMED',
  NEW_QUESTION = 'NEW_QUESTION',
  D_7 = 'D_7',
  D_1 = 'D_1',
  D_DAY = 'D_DAY',
}

export interface INotification extends ModelBase {
  type: NotificationType;
  message: string;
  isRead: boolean;

  userId?: string;
  driverId?: string;

  moveInfoId?: string;
  requestId?: string;
  estimationId?: string;
  questionId?: string;
}

export interface WebsocketNotification {
  type: string;
  data: INotification;
}

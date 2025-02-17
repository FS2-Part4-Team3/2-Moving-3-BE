import { ModelBase } from '#types/common.types.js';

export enum ChatDirection {
  USER_TO_DRIVER = 'USER_TO_DRIVER',
  DRIVER_TO_USER = 'DRIVER_TO_USER',
}

export interface IChat extends ModelBase {
  userId: string;
  driverId: string;

  direction: ChatDirection;
  message: string;
  image?: string;
  isRead: boolean;
}

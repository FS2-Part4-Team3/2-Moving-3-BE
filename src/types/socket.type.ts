import { IDriver } from '#drivers/types/driver.types.js';
import { UserType } from '#types/common.types.js';
import { IUser } from '#users/types/user.types.js';
import { Socket } from 'socket.io';

export interface CustomSocket extends Socket {
  user?: IUser;
  driver?: IDriver;
  type?: UserType;
}

import { IDriver } from '#drivers/types/driver.types.js';
import { UserType } from '#types/common.types.js';
import { User } from '#users/types/user.types.js';
import { Socket } from 'socket.io';

export interface CustomSocket extends Socket {
  user?: User;
  driver?: IDriver;
  type?: UserType;
}

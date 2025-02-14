import { Driver, User } from '@prisma/client';
import { Socket } from 'socket.io';

export interface IWebsocketGateway {
  handleSubscribe(client: Socket, person: User | Driver): void;
  sendNotification(id: string, notification: any): void;
}

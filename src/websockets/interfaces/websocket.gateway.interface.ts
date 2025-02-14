import { WebsocketNotification } from '#websockets/types/websocket.type.js';
import { Driver, User } from '@prisma/client';
import { Socket } from 'socket.io';

export interface IWebsocketGateway {
  handleSubscribe(client: Socket, person: User | Driver): void;
  sendNotification(id: string, notification: WebsocketNotification): void;
}

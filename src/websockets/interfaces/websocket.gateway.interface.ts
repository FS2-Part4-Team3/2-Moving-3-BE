import { IChat } from '#chats/types/chat.types.js';
import { WebsocketNotification } from '#notifications/types/notification.types.js';
import { Driver, User } from '@prisma/client';
import { Socket } from 'socket.io';

export interface IWebsocketGateway {
  handleSubscribe(client: Socket, person: User | Driver): void;
  sendNotification(id: string, notification: WebsocketNotification): void;
  sendChat(id: string, notification: IChat): void;
}

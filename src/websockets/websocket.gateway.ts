import { ChatCreateEvent } from '#chats/events/chat.event.js';
import { IChat } from '#chats/types/chat.types.js';
import { WSPerson } from '#decorators/ws-person.decorator.js';
import { IDriver } from '#drivers/types/driver.types.js';
import { WsJwtGuard } from '#guards/ws-jwt.guard.js';
import { WebsocketNotification } from '#notifications/types/notification.types.js';
import { IUser } from '#users/types/user.types.js';
import logger from '#utils/logger.js';
import { IWebsocketGateway } from '#websockets/interfaces/websocket.gateway.interface.js';
import { UseGuards } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { ConnectedSocket, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({
  cors: {
    origin: ['http://localhost:3000', 'http://www.moving.wiki', 'https://www.moving.wiki'],
    credentials: true,
  },
})
export class WebsocketGateway implements IWebsocketGateway {
  @WebSocketServer()
  server: Server;
  constructor(private readonly eventEmitter: EventEmitter2) {}

  private sockets: Map<string, Socket[]> = new Map();

  private getSockets(key: string) {
    return this.sockets.get(key) || [];
  }

  @UseGuards(WsJwtGuard)
  @SubscribeMessage('subscribe')
  handleSubscribe(@ConnectedSocket() client: Socket, @WSPerson() person: IUser | IDriver) {
    const { id } = person;

    const sockets = this.getSockets(id);
    this.sockets.set(id, [...sockets, client]);

    client.on('disconnect', () => {
      const sockets = this.getSockets(id);
      this.sockets.set(
        id,
        sockets.filter(socket => socket.id !== client.id),
      );
    });

    client.on('chat', data => {
      this.eventEmitter.emit('chat.create', new ChatCreateEvent(data));
    });

    client.on('typing', targetId => {
      this.sendTypingStatus(id, targetId, 'typing');
    });

    client.on('stopped_typing', targetId => {
      this.sendTypingStatus(id, targetId, 'stopped_typing');
    });

    logger.info(`>>>>>>>>>>>>>>>>>>>>>     socket connected - ${id}     <<<<<<<<<<<<<<<<<<<<`);
  }

  sendNotification(id: string, notification: WebsocketNotification) {
    const sockets = this.getSockets(id);
    if (sockets) {
      sockets.forEach(socket => socket.emit('notification', notification));
    }
  }

  sendChat(id: string, chat: IChat) {
    const sockets = this.getSockets(id);
    if (sockets) {
      sockets.forEach(socket => socket.emit('chat', chat));
    }
  }

  sendTypingStatus(id: string, target: string, event: string) {
    const sockets = this.getSockets(target);
    if (sockets) {
      sockets.forEach(socket => socket.emit(event, { id }));
    }
  }
}

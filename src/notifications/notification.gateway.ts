import { WSPerson } from '#decorators/ws-person.decorator.js';
import { Driver } from '#drivers/driver.types.js';
import { WsJwtGuard } from '#guards/ws-jwt.guard.js';
import { INotificationGateway } from '#notifications/interfaces/notification.gateway.interface.js';
import { User } from '#users/user.types.js';
import { UseGuards } from '@nestjs/common';
import { SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class NotificationGateway implements INotificationGateway {
  @WebSocketServer()
  server: Server;

  private sockets: Map<string, Socket[]> = new Map();

  private getSockets(key: string) {
    return this.sockets.get(key) || [];
  }

  @UseGuards(WsJwtGuard)
  @SubscribeMessage('subscribe')
  handleSubscribe(client: Socket, @WSPerson() person: User | Driver) {
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
  }

  sendNotification(id: string, notification: any) {
    const sockets = this.getSockets(id);
    if (sockets) {
      sockets.forEach(socket => socket.emit('notification', notification));
    }
  }
}

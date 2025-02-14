import { WSPerson } from '#decorators/ws-person.decorator.js';
import { Driver } from '#drivers/types/driver.types.js';
import { WsJwtGuard } from '#guards/ws-jwt.guard.js';
import { User } from '#users/types/user.types.js';
import { IWebsocketGateway } from '#websockets/interfaces/websocket.gateway.interface.js';
import { WebsocketNotification } from '#websockets/types/websocket.type.js';
import { UseGuards } from '@nestjs/common';
import { ConnectedSocket, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({
  cors: {
    origin: '*',
    credentials: true,
  },
})
export class WebsocketGateway implements IWebsocketGateway {
  @WebSocketServer()
  server: Server;

  private sockets: Map<string, Socket[]> = new Map();

  private getSockets(key: string) {
    return this.sockets.get(key) || [];
  }

  @UseGuards(WsJwtGuard)
  @SubscribeMessage('subscribe')
  handleSubscribe(@ConnectedSocket() client: Socket, @WSPerson() person: User | Driver) {
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

  sendNotification(id: string, notification: WebsocketNotification) {
    const sockets = this.getSockets(id);
    if (sockets) {
      sockets.forEach(socket => socket.emit('notification', notification));
    }
  }
}

import { GuardModule } from '#guards/guard.module.js';
import { WebsocketGateway } from '#websockets/websocket.gateway.js';
import { Module } from '@nestjs/common';

@Module({
  imports: [GuardModule],
  controllers: [],
  providers: [WebsocketGateway],
  exports: [WebsocketGateway],
})
export class WebSocketModule {}

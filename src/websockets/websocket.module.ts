import { ChatModule } from '#chats/chat.module.js';
import { GuardModule } from '#guards/guard.module.js';
import { WebsocketGateway } from '#websockets/websocket.gateway.js';
import { forwardRef, Module } from '@nestjs/common';

@Module({
  imports: [GuardModule, forwardRef(() => ChatModule)],
  controllers: [],
  providers: [WebsocketGateway],
  exports: [WebsocketGateway],
})
export class WebSocketModule {}

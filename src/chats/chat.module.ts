import { ChatController } from '#chats/chat.controller.js';
import { ChatRepository } from '#chats/chat.repository.js';
import { ChatService } from '#chats/chat.service.js';
import { DBModule } from '#global/db.module.js';
import { GuardModule } from '#guards/guard.module.js';
import { Module } from '@nestjs/common';

@Module({
  imports: [DBModule, GuardModule],
  controllers: [ChatController],
  providers: [ChatService, ChatRepository],
  exports: [],
})
export class ChatModule {}

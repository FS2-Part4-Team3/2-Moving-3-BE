import { Chat } from '#chats/types/chat.types.js';
import { ApiProperty } from '@nestjs/swagger';
import { ChatDirection } from '@prisma/client';

export interface ChatCreateDTO {
  userId: string;
  driverId: string;
  direction: ChatDirection;
  message: string;
}

export class ChatListDTO {
  @ApiProperty({ description: '채팅 목록 수' })
  totalCount: number;

  @ApiProperty({ description: '채팅 목록' })
  list: string[];
}

export class ChatOutputDTO {
  @ApiProperty({ description: '채팅 내역 수' })
  totalCount: number;

  @ApiProperty({ description: '채팅 내역' })
  list: Chat[];
}

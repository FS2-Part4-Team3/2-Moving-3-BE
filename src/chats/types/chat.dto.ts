import { imageRegex } from '#auth/types/auth.types.js';
import { IChat } from '#chats/types/chat.types.js';
import { ModelBase } from '#types/common.types.js';
import { ApiProperty } from '@nestjs/swagger';
import { ChatDirection } from '@prisma/client';
import { IsOptional, IsString, Matches } from 'class-validator';

export interface ChatCreateDTO {
  userId: string;
  driverId: string;
  direction: ChatDirection;
  message: string;
  image?: string;
}

export class ChatPostDTO {
  @IsString({ message: '메시지는 문자열이어야 합니다' })
  @ApiProperty({ description: '메시지' })
  message: string;

  @IsOptional()
  @Matches(imageRegex, { message: '올바른 이미지 형식을 입력해주세요.' })
  @ApiProperty({ description: '이미지' })
  image?: string;
}

export class ChatListDTO {
  @ApiProperty({ description: '채팅 목록 수' })
  totalCount: number;

  @ApiProperty({ description: '채팅 목록' })
  list: string[];
}

export class ChatsDTO {
  @ApiProperty({ description: '채팅 내역 수' })
  totalCount: number;

  @ApiProperty({ description: '채팅 내역' })
  list: IChat[];
}

export class ChatDTO extends ModelBase {
  @ApiProperty({ description: '유저 ID' })
  userId: string;

  @ApiProperty({ description: '기사 ID' })
  driverId: string;

  @ApiProperty({ description: '채팅 방향' })
  direction: ChatDirection;

  @ApiProperty({ description: '메시지' })
  message: string;

  @ApiProperty({ description: '이미지' })
  image?: string;

  @ApiProperty({ description: '읽음 여부' })
  isRead: boolean;
}

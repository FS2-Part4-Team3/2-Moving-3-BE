import { ChatService } from '#chats/chat.service.js';
import { IChatController } from '#chats/interfaces/chat.controller.interface.js';
import { ChatDTO, ChatListDTO, ChatPostDTO } from '#chats/types/chat.dto.js';
import { AccessTokenGuard } from '#guards/access-token.guard.js';
import { ChatGetQueries } from '#types/queries.type.js';
import { Body, Controller, Get, HttpCode, HttpStatus, Param, Post, Query, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';

@Controller('chats')
@UseGuards(AccessTokenGuard)
export class ChatController implements IChatController {
  constructor(private readonly chatService: ChatService) {}

  @Get()
  @ApiOperation({ summary: '채팅 목록 조회' })
  @ApiResponse({ status: HttpStatus.OK, type: ChatListDTO })
  async getList(@Query() query: ChatGetQueries) {
    const { page = 1, pageSize = 10 } = query;

    return await this.chatService.findList({ page, pageSize });
  }

  @Get(':targetId')
  @ApiOperation({ summary: '채팅 내용 조회' })
  @ApiResponse({ status: HttpStatus.OK, type: ChatListDTO })
  async getChats(@Param('targetId') targetId: string, @Query() query: ChatGetQueries) {
    const { page = 1, pageSize = 10 } = query;

    return await this.chatService.findChats(targetId, { page, pageSize });
  }

  @Post(':targetId')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: '채팅 전송' })
  @ApiResponse({ status: HttpStatus.CREATED, type: ChatDTO })
  async postChat(@Param('targetId') targetId: string, @Body() body: ChatPostDTO) {
    return await this.chatService.createChat(targetId, body);
  }

  @Post(':targetId/read')
  @ApiOperation({ summary: '채팅 읽음 처리' })
  @ApiResponse({ status: HttpStatus.OK, type: [ChatDTO] })
  async readNotifications(@Param('targetId') targetId: string, @Body() ids: string[]) {
    return await this.chatService.markChatAsRead(targetId, ids);
  }
}

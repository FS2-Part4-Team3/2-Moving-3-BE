import { IChatController } from '#chats/interfaces/chat.controller.interface.js';
import { IChatService } from '#chats/interfaces/chat.service.interface.js';
import { ChatListDTO } from '#chats/types/chat.dto.js';
import { AccessTokenGuard } from '#guards/access-token.guard.js';
import { ChatGetQueries } from '#types/queries.type.js';
import { Body, Controller, Get, HttpStatus, Param, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';

@Controller('chats')
export class ChatController implements IChatController {
  constructor(private readonly chatService: IChatService) {}

  @Get()
  @UseGuards(AccessTokenGuard)
  @ApiBearerAuth('accessToken')
  @ApiOperation({ summary: '채팅 목록 조회' })
  @ApiResponse({ status: HttpStatus.OK, type: ChatListDTO })
  async getList(@Query() query: ChatGetQueries) {
    const { page = 1, pageSize = 10 } = query;

    return await this.chatService.findList({ page, pageSize });
  }

  @Get(':targetId')
  @UseGuards(AccessTokenGuard)
  @ApiBearerAuth('accessToken')
  @ApiOperation({ summary: '채팅 내용 조회' })
  @ApiResponse({ status: HttpStatus.OK, type: ChatListDTO })
  async getChats(@Param('targetId') targetId: string, @Query() query: ChatGetQueries) {
    const { page = 1, pageSize = 10 } = query;

    return await this.chatService.findChats(targetId, { page, pageSize });
  }

  @Post(':targetId')
  @UseGuards(AccessTokenGuard)
  @ApiBearerAuth('accessToken')
  @ApiOperation({ summary: '채팅 전송' })
  @ApiResponse({ status: HttpStatus.NO_CONTENT })
  async postChat(@Param('targetId') targetId: string, @Body('message') message: string) {
    await this.chatService.createChat(targetId, message);
  }
}

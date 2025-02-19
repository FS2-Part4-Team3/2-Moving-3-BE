import { ChatService } from '#chats/chat.service.js';
import { IChatController } from '#chats/interfaces/chat.controller.interface.js';
import { ChatDTO, ChatImageUploadDTO, ChatListDTO, ChatReadInputDTO, ChatsDTO } from '#chats/types/chat.dto.js';
import { AccessTokenGuard } from '#guards/access-token.guard.js';
import { ChatGetQueries } from '#types/queries.type.js';
import { Body, Controller, Get, HttpCode, HttpStatus, Param, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiResponse } from '@nestjs/swagger';

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
  @ApiResponse({ status: HttpStatus.OK, type: ChatsDTO })
  async getChats(@Param('targetId') targetId: string, @Query() query: ChatGetQueries) {
    const { page = 1, pageSize = 10 } = query;

    return await this.chatService.findChats(targetId, { page, pageSize });
  }

  @Post('image')
  @UseGuards(AccessTokenGuard)
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: '채팅 이미지 업로드' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        image: { type: 'string', description: '이미지 파일명' },
      },
    },
  })
  @ApiResponse({ status: HttpStatus.CREATED, type: ChatImageUploadDTO })
  async postChatImage(@Body('image') image: string) {
    return await this.chatService.createImageUploadUrl(image);
  }

  @Post(':targetId/read')
  @ApiOperation({ summary: '채팅 읽음 처리' })
  @ApiBody({ type: ChatReadInputDTO })
  @ApiResponse({ status: HttpStatus.OK, type: [ChatDTO] })
  async readNotifications(@Param('targetId') targetId: string, @Body('ids') ids: string[]) {
    return await this.chatService.markChatAsRead(targetId, ids);
  }
}

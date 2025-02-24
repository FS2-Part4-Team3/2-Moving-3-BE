import { ChatRepository } from '#chats/chat.repository.js';
import { ChatCreateEvent } from '#chats/events/chat.event.js';
import { IChatService } from '#chats/interfaces/chat.service.interface.js';
import { ChatCreateDTO } from '#chats/types/chat.dto.js';
import { ChatDirection } from '#chats/types/chat.types.js';
import { BadRequestException } from '#exceptions/http.exception.js';
import { MoveRepository } from '#move/move.repository.js';
import { IStorage, UserType } from '#types/common.types.js';
import { OffsetPaginationOptions } from '#types/options.type.js';
import { generateS3DownloadUrlForChat } from '#utils/S3/generate-s3-download-url.js';
import { generateS3UploadUrl } from '#utils/S3/generate-s3-upload-url.js';
import { WebsocketGateway } from '#websockets/websocket.gateway.js';
import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { AsyncLocalStorage } from 'async_hooks';

@Injectable()
export class ChatService implements IChatService {
  constructor(
    private readonly chatRepository: ChatRepository,
    private readonly moveRepository: MoveRepository,
    private readonly websocketGateway: WebsocketGateway,
    private readonly als: AsyncLocalStorage<IStorage>,
  ) {}

  @OnEvent('chat.create')
  handleChatCreate(event: ChatCreateEvent) {
    return this.createChat(event.chatData);
  }

  async findList(options: OffsetPaginationOptions) {
    const { userId, driverId, type } = this.als.getStore();
    const validId = type === UserType.User ? userId : driverId;

    const totalCount = await this.chatRepository.countList(validId, type);
    const uniqueIds = await this.chatRepository.findList(validId, type, options);
    const list = uniqueIds.map(record => (type === UserType.User ? record.driverId : record.userId));
    if (type === UserType.Driver) {
      const moves = await Promise.all(list.map(async userId => (await this.moveRepository.findByUserId(userId))[0]));
      return { totalCount, list, moves };
    } else {
      return { totalCount, list };
    }
  }

  async findChats(targetId: string, options: OffsetPaginationOptions) {
    const { userId, driverId, type } = this.als.getStore();

    const totalCount =
      type === UserType.User
        ? await this.chatRepository.countChats(userId, targetId)
        : await this.chatRepository.countChats(targetId, driverId);
    const list =
      type === UserType.User
        ? await this.chatRepository.findChats(userId, targetId, options)
        : await this.chatRepository.findChats(targetId, driverId, options);

    list.forEach(async chat => await generateS3DownloadUrlForChat(chat.ownerId, chat));

    return { totalCount, list };
  }

  async createChat({ userId, driverId, direction, message, image }: ChatCreateDTO) {
    const ownerId = direction === ChatDirection.USER_TO_DRIVER ? userId : driverId;
    const targetId = direction === ChatDirection.USER_TO_DRIVER ? driverId : userId;

    const data = { userId, driverId, direction, message, image };

    const chat = await this.chatRepository.create(data);
    await generateS3DownloadUrlForChat(ownerId, chat);
    this.websocketGateway.sendChat(targetId, chat);

    return chat;
  }

  async createImageUploadUrl(image: string) {
    if (!image) {
      throw new BadRequestException('파일명이 올바르지 않습니다.');
    }

    const { userId, driverId, type } = this.als.getStore();
    const ownerId = type === UserType.User ? userId : driverId;

    const { uploadUrl, uniqueFileName } = await generateS3UploadUrl(ownerId, image);

    return { uploadUrl, uniqueFileName };
  }

  async markChatAsRead(targetId: string, chatIds: string[], isRead: boolean = true) {
    const { type, userId, driverId } = this.als.getStore();

    const chats =
      type === UserType.User
        ? await this.chatRepository.updateManyAsRead(userId, targetId, chatIds, isRead)
        : await this.chatRepository.updateManyAsRead(targetId, driverId, chatIds, isRead);

    const validId = type === UserType.User ? userId : driverId;
    this.websocketGateway.sendNotification(validId, { type: 'CHATS_READ', data: chats });

    return chats;
  }
}

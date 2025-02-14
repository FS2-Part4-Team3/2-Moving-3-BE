import { ChatRepository } from '#chats/chat.repository.js';
import { IChatService } from '#chats/interfaces/chat.service.interface.js';
import { ChatPostDTO } from '#chats/types/chat.dto.js';
import { IStorage, UserType } from '#types/common.types.js';
import { OffsetPaginationOptions } from '#types/options.type.js';
import { generateS3DownloadUrlForChat } from '#utils/S3/generate-s3-download-url.js';
import { generateS3UploadUrl } from '#utils/S3/generate-s3-upload-url.js';
import { WebsocketGateway } from '#websockets/websocket.gateway.js';
import { Injectable } from '@nestjs/common';
import { ChatDirection } from '@prisma/client';
import { AsyncLocalStorage } from 'async_hooks';

@Injectable()
export class ChatService implements IChatService {
  constructor(
    private readonly chatRepository: ChatRepository,
    private readonly websocketGateway: WebsocketGateway,
    private readonly als: AsyncLocalStorage<IStorage>,
  ) {}

  async findList(options: OffsetPaginationOptions) {
    const { userId, driverId, type } = this.als.getStore();
    const validId = type === UserType.User ? userId : driverId;

    const totalCount = await this.chatRepository.countList(validId, type);
    const driverIds = await this.chatRepository.findList(validId, type, options);
    const list = driverIds.map(record => record.driverId);

    return { totalCount, list };
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

    return { totalCount, list };
  }

  async createChat(targetId: string, body: ChatPostDTO) {
    const { userId, driverId, type } = this.als.getStore();
    const { message } = body;
    const ownerId = type === UserType.User ? userId : driverId;

    let url;
    let fileName;
    if (body.image) {
      const { uploadUrl, uniqueFileName } = await generateS3UploadUrl(ownerId, body.image);
      fileName = uniqueFileName;
      url = uploadUrl;
    }

    const data =
      type === UserType.User
        ? { userId, driverId: targetId, direction: ChatDirection.USER_TO_DRIVER, message, image: fileName }
        : { userId: targetId, driverId, direction: ChatDirection.DRIVER_TO_USER, message, image: fileName };

    const chat = await this.chatRepository.create(data);
    await generateS3DownloadUrlForChat(ownerId, chat);
    this.websocketGateway.sendNotification(targetId, { type: 'NEW_CHAT', data: chat });

    chat.image = body.image;
    chat.uploadUrl = url;

    return chat;
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

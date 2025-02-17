import { ChatPostDTO } from '#chats/types/chat.dto.js';
import { IChat } from '#chats/types/chat.types.js';
import { OffsetPaginationOptions } from '#types/options.type.js';

export interface IChatService {
  findList(options: OffsetPaginationOptions): Promise<{ totalCount: number; list: string[] }>;
  findChats(targetId: string, options: OffsetPaginationOptions): Promise<{ totalCount: number; list: IChat[] }>;
  createChat(targetId: string, body: ChatPostDTO): Promise<IChat>;
  markChatAsRead(targetId: string, chatIds: string[], isRead: boolean): Promise<IChat[]>;
}

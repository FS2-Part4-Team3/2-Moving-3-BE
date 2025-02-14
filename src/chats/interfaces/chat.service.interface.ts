import { ChatPostDTO } from '#chats/types/chat.dto.js';
import { Chat } from '#chats/types/chat.types.js';
import { OffsetPaginationOptions } from '#types/options.type.js';

export interface IChatService {
  findList(options: OffsetPaginationOptions): Promise<{ totalCount: number; list: string[] }>;
  findChats(targetId: string, options: OffsetPaginationOptions): Promise<{ totalCount: number; list: Chat[] }>;
  createChat(targetId: string, body: ChatPostDTO): Promise<Chat>;
  markChatAsRead(targetId: string, chatIds: string[], isRead: boolean): Promise<Chat[]>;
}

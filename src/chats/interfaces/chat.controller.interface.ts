import { Chat } from '#chats/types/chat.types.js';
import { ChatGetQueries } from '#types/queries.type.js';

export interface IChatController {
  getList(query: ChatGetQueries): Promise<{ totalCount: number; list: string[] }>;
  getChats(targetId: string, query: ChatGetQueries): Promise<{ totalCount: number; list: Chat[] }>;
  postChat(targetId: string, message: string): Promise<Chat>;
}

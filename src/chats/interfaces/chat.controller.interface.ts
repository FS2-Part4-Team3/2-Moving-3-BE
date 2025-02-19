import { ChatImageUploadDTO } from '#chats/types/chat.dto.js';
import { IChat } from '#chats/types/chat.types.js';
import { ChatGetQueries } from '#types/queries.type.js';

export interface IChatController {
  getList(query: ChatGetQueries): Promise<{ totalCount: number; list: string[] }>;
  getChats(targetId: string, query: ChatGetQueries): Promise<{ totalCount: number; list: IChat[] }>;
  postChatImage(image: string): Promise<ChatImageUploadDTO>;
}

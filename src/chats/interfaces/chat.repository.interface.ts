import { ChatCreateDTO } from '#chats/types/chat.dto.js';
import { IChat } from '#chats/types/chat.types.js';
import { UserType } from '#types/common.types.js';
import { OffsetPaginationOptions } from '#types/options.type.js';

export interface IChatRepository {
  countList(id: string, userType: UserType): Promise<number>;
  countChats(userId: string, driverId: string): Promise<number>;
  findList(id: string, userType: UserType, options: OffsetPaginationOptions): Promise<string[]>;
  findChats(userId: string, driverId: string, options: OffsetPaginationOptions): Promise<IChat[]>;
  create(data: ChatCreateDTO): Promise<IChat>;
  updateManyAsRead(userId: string, driverId: string, chatIds: string[], isRead: boolean): Promise<IChat>;
}

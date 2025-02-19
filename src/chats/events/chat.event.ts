import { IChat } from '#chats/types/chat.types.js';

export class ChatCreateEvent {
  constructor(public readonly chatData: IChat) {}
}

import { ChatDirection } from '@prisma/client';

export interface ChatCreateDTO {
  userId: string;
  driverId: string;
  direction: ChatDirection;
  message: string;
}

import { ModelBase } from '#types/common.types.js';
import { Chat as PrismaChat } from '@prisma/client';

interface PrismaChatBase extends Omit<PrismaChat, keyof ModelBase> {}
interface ChatBase extends PrismaChatBase {}

export interface Chat extends ChatBase, ModelBase {}

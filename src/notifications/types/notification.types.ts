import { ModelBase } from '#types/common.types.js';
import { Notification as PrismaNotification } from '@prisma/client';

interface PrismaNotificationBase extends Omit<PrismaNotification, keyof ModelBase> {}
interface NotificationBase extends PrismaNotificationBase {}

export interface Notification extends NotificationBase, ModelBase {}

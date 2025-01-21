import { INotificationGateway } from '#notifications/interfaces/notification.gateway.interface.js';
import { WebSocketGateway } from '@nestjs/websockets';

@WebSocketGateway()
export class NotificationGateway implements INotificationGateway {}

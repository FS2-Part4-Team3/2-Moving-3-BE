import { INotificationService } from '#notifications/interfaces/notification.service.interface.js';
import {
  NotificationInvalidRelationException,
  NotificationInvalidTargetException,
  NotificationInvalidTypeException,
} from '#notifications/notification.exception.js';
import { NotificationRepository } from '#notifications/notification.repository.js';
import { notificationMessages } from '#notifications/notifications.messages.js';
import { NotificationCreateDTO } from '#notifications/types/notification.dto.js';
import { IStorage, UserType } from '#types/common.types.js';
import { WebsocketGateway } from '#websockets/websocket.gateway.js';
import { Injectable } from '@nestjs/common';
import { NotificationType } from '@prisma/client';
import { AsyncLocalStorage } from 'async_hooks';

@Injectable()
export class NotificationService implements INotificationService {
  constructor(
    private readonly notificationRepository: NotificationRepository,
    private readonly websocketGateway: WebsocketGateway,
    private readonly als: AsyncLocalStorage<IStorage>,
  ) {}

  private validateNotificationData(data: NotificationCreateDTO) {
    for (const key in data) {
      if (data[key] === '') {
        data[key] = null;
      }
    }

    const { userId, driverId, type, moveInfoId, requestId, estimationId, questionId } = data;

    // NOTE 유저 타입이 하나인가
    if ((userId && driverId) || (!userId && !driverId)) {
      throw new NotificationInvalidTargetException();
    }

    const relationIds = [moveInfoId, requestId, estimationId, questionId];
    // NOTE relation 객체가 둘 이상 존재하는가
    if (relationIds.filter(id => id).length >= 2) {
      throw new NotificationInvalidRelationException();
    }

    // NOTE 유저 타입 검증
    switch (type) {
      case NotificationType.MOVE_INFO_EXPIRED:
      case NotificationType.NEW_ESTIMATION:
      case NotificationType.REQUEST_REJECTED:
        if (!userId) {
          throw new NotificationInvalidTargetException();
        }
        break;
      case NotificationType.NEW_REQUEST:
      case NotificationType.ESTIMATION_CONFIRMED:
        if (!driverId) {
          throw new NotificationInvalidTargetException();
        }
        break;
      case NotificationType.NEW_QUESTION:
      case NotificationType.D_7:
      case NotificationType.D_1:
      case NotificationType.D_DAY:
        break;
      default:
        throw new NotificationInvalidTypeException();
    }

    // NOTE relation 객체 검증
    switch (type) {
      case NotificationType.MOVE_INFO_EXPIRED:
      case NotificationType.D_7:
      case NotificationType.D_1:
      case NotificationType.D_DAY:
        if (!moveInfoId) {
          throw new NotificationInvalidRelationException('이사 정보를 입력해주세요.');
        }
        break;
      case NotificationType.NEW_ESTIMATION:
      case NotificationType.ESTIMATION_CONFIRMED:
        if (!estimationId) {
          throw new NotificationInvalidRelationException('견적 정보를 입력해주세요.');
        }
        break;
      case NotificationType.NEW_REQUEST:
      case NotificationType.REQUEST_REJECTED:
        if (!requestId) {
          throw new NotificationInvalidRelationException('지정 요청 정보를 입력해주세요.');
        }
        break;
      case NotificationType.NEW_QUESTION:
        if (!questionId) {
          throw new NotificationInvalidRelationException('문의 정보를 입력해주세요.');
        }
        break;
      default:
        throw new NotificationInvalidTypeException();
    }
  }

  async getNotifications(page: number, pageSize: number) {
    const { type, userId, driverId } = this.als.getStore();
    const validId = type === UserType.User ? userId : driverId;

    const totalCount = await this.notificationRepository.count(type, validId);
    const list = await this.notificationRepository.findMany(type, validId, page, pageSize);

    return { totalCount, list };
  }

  async createNotification(data: NotificationCreateDTO) {
    this.validateNotificationData(data);
    data.message = notificationMessages[data.type];

    const notification = await this.notificationRepository.create(data);

    const validId = notification.userId || notification.driverId;
    this.websocketGateway.sendNotification(validId, { type: 'NEW_NOTIFICATION', data: notification });

    return notification;
  }

  async markNotificationAsRead(notificationIds: string[]) {
    const { type, userId, driverId } = this.als.getStore();

    const validId = type === UserType.User ? userId : driverId;
    const notifications = await this.notificationRepository.updateManyAsRead(type, validId, notificationIds);

    this.websocketGateway.sendNotification(validId, { type: 'NOTIFICATIONS_READ', data: notifications });

    return notifications;
  }
}

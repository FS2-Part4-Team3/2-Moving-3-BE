import { MoveRepository } from '#move/move.repository.js';
import { NotificationService } from '#notifications/notification.service.js';
import { getNextDate, getNextWeek } from '#utils/dateUtils.js';
import logger from '#utils/logger.js';
import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { NotificationType } from '@prisma/client';

@Injectable()
export class NotificationScheduler {
  constructor(
    private readonly moveRepository: MoveRepository,
    private readonly notificationService: NotificationService,
  ) {}

  private getMessageForToday(date: Date) {
    return `오늘 ${date.toLocaleDateString()}에 이사가 예정되어 있습니다.`;
  }

  private getMessageForNextWeek(date: Date) {
    return `일주일 후인 ${date.toLocaleDateString()}에 이사가 예정되어 있습니다.`;
  }

  @Cron(CronExpression.EVERY_DAY_AT_6PM)
  async createNotificationForTodayAndNextWeek() {
    try {
      const today = new Date();
      const nextDay = getNextDate(today);
      const nextWeek = getNextWeek(today);

      const todaysMoves = await this.moveRepository.findManyByDate(today);
      const nextDaysMoves = await this.moveRepository.findManyByDate(nextDay);
      const nextWeekMoves = await this.moveRepository.findManyByDate(nextWeek);

      for (const move of todaysMoves) {
        await this.createMoveNotification(move, NotificationType.D_DAY);
      }
      for (const move of nextDaysMoves) {
        await this.createMoveNotification(move, NotificationType.D_1);
      }
      for (const move of nextWeekMoves) {
        await this.createMoveNotification(move, NotificationType.D_7);
      }
    } catch (error) {
      logger.error('알림 스케쥴러 오류', error);
    }
  }

  private async createMoveNotification(move: any, type: NotificationType) {
    try {
      const message =
        type === NotificationType.D_DAY ? this.getMessageForToday(move.date) : this.getMessageForNextWeek(move.date);
      // 사용자 알림
      await this.notificationService.createNotification({
        userId: move.ownerId,
        moveInfoId: move.id,
        type,
        message,
      });

      // 기사 알림, 존재 여부는 move 레이어에 맡김
      await this.notificationService.createNotification({
        driverId: move.confirmedEstimation.driverId,
        moveInfoId: move.id,
        type,
        message,
      });
    } catch (error) {
      logger.error(`${move.id}에 대한 알림 생성 실패`, error);
    }
  }

  @Cron(CronExpression.EVERY_HOUR)
  async healthCheck() {
    logger.info('알림 스케쥴러 작동중');
  }
}

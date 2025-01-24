import { PrismaService } from '#global/prisma.service.js';
import { AccessTokenGuard } from '#guards/access-token.guard.js';
import { NotificationService } from '#notifications/notification.service.js';
import { Body, Controller, DefaultValuePipe, Get, Param, ParseIntPipe, Post, Query, UseGuards } from '@nestjs/common';
import { ApiExcludeEndpoint } from '@nestjs/swagger';

@Controller('notification')
@UseGuards(AccessTokenGuard)
export class NotificationController {
  constructor(
    private readonly notificationService: NotificationService,
    private readonly prisma: PrismaService,
  ) {}

  @Get('')
  async getNotifications(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('pageSize', new DefaultValuePipe(10), ParseIntPipe) pageSize: number,
  ) {
    const notifications = await this.notificationService.getNotifications(page, pageSize);

    return notifications;
  }

  @Post('read')
  async readNotifications(@Body() ids: string[]) {
    const notifications = await this.notificationService.markNotificationAsRead(ids);

    return notifications;
  }

  @Post(':id/read')
  async readNotification(@Param('id') id: string) {
    const notifications = await this.notificationService.markNotificationAsRead([id]);

    return notifications;
  }

  @Post('push')
  @ApiExcludeEndpoint()
  async createNotificationTest(@Body() body: any) {
    const notification = await this.notificationService.createNotification(body);

    return notification;
  }
}

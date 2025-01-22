import { AccessTokenGuard } from '#guards/access-token.guard.js';
import { NotificationService } from '#notifications/notification.service.js';
import { Body, Controller, DefaultValuePipe, Get, Param, ParseIntPipe, Post, Query, UseGuards } from '@nestjs/common';

@Controller('notification')
@UseGuards(AccessTokenGuard)
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

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
}

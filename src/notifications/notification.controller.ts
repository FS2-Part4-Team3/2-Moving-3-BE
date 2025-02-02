import { AccessTokenGuard } from '#guards/access-token.guard.js';
import { NotificationService } from '#notifications/notification.service.js';
import { NotificationListDTO, NotificationOutputDTO } from '#notifications/types/notification.dto.js';
import { Body, Controller, DefaultValuePipe, Get, HttpStatus, Param, ParseIntPipe, Post, Query, UseGuards } from '@nestjs/common';
import { ApiExcludeEndpoint, ApiOperation, ApiResponse } from '@nestjs/swagger';

@Controller('notification')
@UseGuards(AccessTokenGuard)
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @Get()
  @ApiOperation({ summary: '알림 조회' })
  @ApiResponse({ status: HttpStatus.OK, type: NotificationListDTO })
  async getNotifications(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('pageSize', new DefaultValuePipe(10), ParseIntPipe) pageSize: number,
  ) {
    const notifications = await this.notificationService.getNotifications(page, pageSize);

    return notifications;
  }

  @Post('read')
  @ApiOperation({ summary: '알림 읽음 처리(목록)' })
  @ApiResponse({ status: HttpStatus.OK, type: [NotificationOutputDTO] })
  async readNotifications(@Body() ids: string[]) {
    const notifications = await this.notificationService.markNotificationAsRead(ids);

    return notifications;
  }

  @Post(':id/read')
  @ApiOperation({ summary: '알림 읽음 처리(단일)' })
  @ApiResponse({ status: HttpStatus.OK, type: NotificationOutputDTO })
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

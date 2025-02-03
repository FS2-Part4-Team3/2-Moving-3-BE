import { JwtGenerateService } from '#auth/jwt-generate.service.js';
import { PrismaService } from '#global/prisma.service.js';
import { AccessTokenGuard } from '#guards/access-token.guard.js';
import { NotificationService } from '#notifications/notification.service.js';
import { IStorage, UserType } from '#types/common.types.js';
import { generateS3UploadUrl } from '#utils/S3/generate-s3-upload-url.js';
import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { ApiExcludeController } from '@nestjs/swagger';
import { AsyncLocalStorage } from 'async_hooks';

@ApiExcludeController()
@Controller('dev')
export class DevController {
  constructor(
    private readonly notificationService: NotificationService,
    private readonly prisma: PrismaService,
    private readonly jwtGenerateService: JwtGenerateService,
    private readonly als: AsyncLocalStorage<IStorage>,
  ) {}

  @Get('users')
  async getUsers() {
    return await this.prisma.user.findMany();
  }

  @Get('drivers')
  async getDrivers() {
    return await this.prisma.driver.findMany();
  }

  @Get('estimations')
  async getEstimations() {
    return await this.prisma.estimation.findMany();
  }

  @Get('moves')
  async getMoveInfos() {
    return await this.prisma.moveInfo.findMany();
  }

  @Get('notifications')
  async getNotifications() {
    return await this.prisma.notification.findMany();
  }

  @Get('questions')
  async getQuestions() {
    return await this.prisma.question.findMany();
  }

  @Get('requests')
  async getRequests() {
    return await this.prisma.request.findMany();
  }

  @Get('reviews')
  async getReviews() {
    return await this.prisma.review.findMany();
  }

  @Get('login/user')
  async userLogin() {
    const [user] = await this.prisma.user.findMany({
      orderBy: { createdAt: 'desc' },
      take: 1,
    });

    const accessToken = await this.jwtGenerateService.generateAccessToken({ id: user.id, type: UserType.User });

    return { user, accessToken };
  }

  @Get('login/driver')
  async driverLogin() {
    const [driver] = await this.prisma.driver.findMany({
      orderBy: { createdAt: 'desc' },
      take: 1,
    });

    const accessToken = await this.jwtGenerateService.generateAccessToken({ id: driver.id, type: UserType.Driver });

    return { driver, accessToken };
  }

  @Get('parse-token')
  @UseGuards(AccessTokenGuard)
  async parseToken() {
    const storage = this.als.getStore();

    return storage;
  }

  @Get('upload')
  async upload(@Query('image') image: string) {
    const url = await generateS3UploadUrl('id', image);

    return url;
  }

  @Post('notification/push')
  async createNotificationTest(@Body() body: any) {
    const notification = await this.notificationService.createNotification(body);

    return notification;
  }
}

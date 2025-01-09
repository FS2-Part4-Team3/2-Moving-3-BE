import { JwtGenerateService } from '#auth/jwt-generate.service.js';
import { PrismaService } from '#global/prisma.service.js';
import { UserService } from '#users/user.service.js';
import { Controller, Get, Query } from '@nestjs/common';

@Controller('dev')
export class DevController {
  constructor(
    private readonly userService: UserService,
    private readonly prismaService: PrismaService,
    private readonly jwtGenerateService: JwtGenerateService,
  ) {}

  @Get('users')
  async getUsers(@Query() query) {
    const { page = 1, pageSize = 10, orderBy = 'latest', keyword = '' } = query;
    const options = { page, pageSize, orderBy, keyword };
    const users = await this.userService.getUsers(options);

    return users;
  }

  @Get('login')
  async login() {
    const [user] = await this.prismaService.user.findMany({
      orderBy: { createdAt: 'desc' },
      take: 1,
    });

    const accessToken = await this.jwtGenerateService.generateAccessToken({ userId: user.id });

    return { user, accessToken };
  }
}

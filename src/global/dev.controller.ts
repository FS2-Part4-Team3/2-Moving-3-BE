import { JwtGenerateService } from '#auth/jwt-generate.service.js';
import { PrismaService } from '#global/prisma.service.js';
import { AccessTokenGuard } from '#guards/access-token.guard.js';
import { ALS, UserType } from '#types/common.types.js';
import { UserService } from '#users/user.service.js';
import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ApiExcludeController } from '@nestjs/swagger';

@ApiExcludeController()
@Controller('dev')
export class DevController {
  constructor(
    private readonly userService: UserService,
    private readonly prismaService: PrismaService,
    private readonly jwtGenerateService: JwtGenerateService,
    private readonly als: ALS,
  ) {}

  @Get('users')
  async getUsers(@Query() query) {
    const { page = 1, pageSize = 10, orderBy = 'latest', keyword = '' } = query;
    const options = { page, pageSize, orderBy, keyword };
    const users = await this.userService.getUsers(options);

    return users;
  }

  @Get('login/user')
  async userLogin() {
    const [user] = await this.prismaService.user.findMany({
      orderBy: { createdAt: 'desc' },
      take: 1,
    });

    const accessToken = await this.jwtGenerateService.generateAccessToken({ id: user.id, type: UserType.User });

    return { user, accessToken };
  }

  @Get('login/driver')
  async driverLogin() {
    const [driver] = await this.prismaService.driver.findMany({
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
}

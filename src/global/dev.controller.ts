import { AccessTokenGuard } from '#auth/guards/access-token.guard.js';
import { IStorage } from '#types/common.types.js';
import { UserService } from '#users/user.service.js';
import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { AsyncLocalStorage } from 'async_hooks';

@Controller('dev')
export class DevController {
  constructor(
    private readonly userService: UserService,
    private readonly als: AsyncLocalStorage<IStorage>,
  ) {}

  @Get('users')
  async getUsers(@Query() query) {
    const { page = 1, pageSize = 10, orderBy = 'latest', keyword = '' } = query;
    const options = { page, pageSize, orderBy, keyword };
    const users = await this.userService.getUsers(options);

    return users;
  }

  @Get('parse-token')
  @UseGuards(AccessTokenGuard)
  async parseToken() {
    const storage = this.als.getStore();

    return storage;
  }
}

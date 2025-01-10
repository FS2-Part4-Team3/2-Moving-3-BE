import { UserService } from '#users/user.service.js';
import { Controller, Get, Query } from '@nestjs/common';

@Controller('dev')
export class DevController {
  constructor(private readonly userService: UserService) {}

  @Get('users')
  async getUsers(@Query() query) {
    const { page = 1, pageSize = 10, orderBy = 'latest', keyword = '' } = query;
    const options = { page, pageSize, orderBy, keyword };
    const users = await this.userService.getUsers(options);

    return users;
  }
}

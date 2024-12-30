import { UserService } from '#users/user.service.js';
import { Controller, Post } from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('watch')
  @ApiOperation({ summary: '기사 찜하기' })
  async watch() {}

  @Post('share')
  @ApiOperation({ summary: '기사 정보 공유하기' })
  async share() {}
}

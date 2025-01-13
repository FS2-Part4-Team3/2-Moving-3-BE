import { AccessTokenGuard } from '#guards/access-token.guard.js';
import { IUserController } from '#users/interfaces/user.controller.interface.js';
import { UserService } from '#users/user.service.js';
import { UserPatchDTO } from '#users/user.types.js';
import { Body, Controller, Patch, Post, UseGuards } from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';

@Controller('users')
export class UserController implements IUserController {
  constructor(private readonly userService: UserService) {}

  @Post('watch')
  @ApiOperation({ summary: '기사 찜하기' })
  async watch() {}

  @Post('share')
  @ApiOperation({ summary: '기사 정보 공유하기' })
  async share() {}

  @Patch('update')
  @UseGuards(AccessTokenGuard)
  @ApiOperation({ summary: '유저 정보 수정' })
  async patchUser(@Body() body: UserPatchDTO) {
    const user = await this.userService.updateUser(body);

    return user;
  }
}

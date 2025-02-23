import { FilteredUserOutputDTO } from '#auth/types/filtered.user.dto.js';
import { AccessTokenGuard } from '#guards/access-token.guard.js';
import { IUserController } from '#users/interfaces/user.controller.interface.js';
import { UserPatchDTO } from '#users/types/user.dto.js';
import { UserService } from '#users/user.service.js';
import { Body, Controller, Get, HttpStatus, Param, Patch, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';

@Controller('users')
export class UserController implements IUserController {
  constructor(private readonly userService: UserService) {}

  @Get(':id')
  @ApiOperation({ summary: '유저 정보 조회' })
  @ApiResponse({
    status: HttpStatus.OK,
    type: FilteredUserOutputDTO,
  })
  async getUser(@Param('id') id: string) {
    const user = await this.userService.findUser(id);

    return user;
  }

  @Patch('update')
  @UseGuards(AccessTokenGuard)
  @ApiOperation({ summary: '유저 정보 수정' })
  @ApiBearerAuth('accessToken')
  @ApiResponse({
    status: HttpStatus.OK,
    type: FilteredUserOutputDTO,
  })
  async patchUser(@Body() body: UserPatchDTO) {
    const user = await this.userService.updateUser(body);

    return user;
  }
}

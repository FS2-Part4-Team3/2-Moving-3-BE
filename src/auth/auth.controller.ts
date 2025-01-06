import { AuthService } from '#auth/auth.service.js';
import { AccessTokenGuard } from '#auth/guards/access-token.guard.js';
import { HashPasswordGuard } from '#auth/guards/hash-password.guard.js';
import { IAuthController } from '#auth/interfaces/auth.controller.interface.js';
import { UserInputDTO } from '#users/user.types.js';
import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';

@Controller('auth')
export class AuthController implements IAuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signUp')
  @UseGuards(HashPasswordGuard)
  @ApiOperation({ summary: '회원가입' })
  async signUp(@Body() body: UserInputDTO) {
    const user = await this.authService.createUser(body);

    return user;
  }

  @Post('signIn')
  @ApiOperation({ summary: '로그인' })
  async signIn() {}

  @Get('me')
  @UseGuards(AccessTokenGuard)
  @ApiOperation({ summary: '로그인 유저 정보 조회' })
  async getMe() {
    const user = await this.authService.getMe();

    return user;
  }

  @Post('refresh')
  @ApiOperation({ summary: '토큰 재발급' })
  async refreshToken() {}
}

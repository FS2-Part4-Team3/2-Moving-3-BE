import { AuthService } from '#auth/auth.service.js';
import { IAuthController } from '#auth/interfaces/auth.controller.interface.js';
import { Controller, Get, Post } from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';

@Controller('auth')
export class AuthController implements IAuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signUp')
  @ApiOperation({ summary: '회원가입' })
  async signUp() {}

  @Post('signIn')
  @ApiOperation({ summary: '로그인' })
  async signIn() {}

  @Get('me')
  @ApiOperation({ summary: '로그인 유저 정보 조회' })
  async getMe() {}

  @Post('refresh')
  @ApiOperation({ summary: '토큰 재발급' })
  async refreshToken() {}
}

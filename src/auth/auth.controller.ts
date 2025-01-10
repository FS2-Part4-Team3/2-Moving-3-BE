import { AuthService } from '#auth/auth.service.js';
import { SignInDTO } from '#auth/auth.types.js';
import { AccessTokenGuard } from '#auth/guards/access-token.guard.js';
import { HashPasswordGuard } from '#auth/guards/hash-password.guard.js';
import { RefreshTokenGuard } from '#auth/guards/refresh-token.guard.js';
import { IAuthController } from '#auth/interfaces/auth.controller.interface.js';
import { UserPostDTO } from '#users/user.types.js';
import { Body, Controller, Get, Post, Res, UseGuards } from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';
import { Response } from 'express';

@Controller('auth')
export class AuthController implements IAuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signUp')
  @UseGuards(HashPasswordGuard)
  @ApiOperation({ summary: '회원가입' })
  async signUp(@Body() body: UserPostDTO, @Res({ passthrough: true }) response: Response) {
    const { user, accessToken, refreshToken } = await this.authService.createUser(body);
    response.cookie('refreshToken', refreshToken);

    return { user, accessToken };
  }

  @Post('signIn')
  @ApiOperation({ summary: '로그인' })
  async signIn(@Body() body: SignInDTO, @Res({ passthrough: true }) response: Response) {
    const { user, accessToken, refreshToken } = await this.authService.signIn(body);
    response.cookie('refreshToken', refreshToken);

    return { user, accessToken };
  }

  @Get('me')
  @UseGuards(AccessTokenGuard)
  @ApiOperation({ summary: '로그인 유저 정보 조회' })
  async getMe() {
    const user = await this.authService.getMe();

    return user;
  }

  @Post('refresh')
  @UseGuards(RefreshTokenGuard)
  @ApiOperation({ summary: '토큰 재발급' })
  async refreshToken(@Res({ passthrough: true }) response: Response) {
    const { user, accessToken, refreshToken } = await this.authService.getNewToken();
    response.cookie('refreshToken', refreshToken);

    return { user, accessToken };
  }
}

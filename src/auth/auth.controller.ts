import { AuthService } from '#auth/auth.service.js';
import { SignInDTO, SignUpDTO } from '#auth/auth.types.js';
import { IAuthController } from '#auth/interfaces/auth.controller.interface.js';
import { BadRequestException } from '#exceptions/http.exception.js';
import { AccessTokenGuard } from '#guards/access-token.guard.js';
import { HashPasswordGuard } from '#guards/hash-password.guard.js';
import { RefreshTokenGuard } from '#guards/refresh-token.guard.js';
import { UserType } from '#types/common.types.js';
import { Body, Controller, Get, Param, Post, Res, UseGuards } from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';
import { Response } from 'express';

@Controller('auth')
export class AuthController implements IAuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signUp/:userType')
  @UseGuards(HashPasswordGuard)
  @ApiOperation({ summary: '회원가입' })
  async signUp(
    @Body() body: SignUpDTO,
    @Param('userType') userType: 'user' | 'driver',
    @Res({ passthrough: true }) response: Response,
  ) {
    if (!['user', 'driver'].includes(userType)) {
      throw new BadRequestException();
    }
    const type = userType === 'user' ? UserType.User : UserType.Driver;

    const { person, accessToken, refreshToken } = await this.authService.createPerson(body, type);
    response.cookie('refreshToken', refreshToken);

    const result = type === UserType.User ? { user: person, accessToken } : { driver: person, accessToken };
    return result;
  }

  @Post('signIn/:userType')
  @ApiOperation({ summary: '로그인' })
  async signIn(
    @Body() body: SignInDTO,
    @Param('userType') userType: 'user' | 'driver',
    @Res({ passthrough: true }) response: Response,
  ) {
    if (!['user', 'driver'].includes(userType)) {
      throw new BadRequestException();
    }
    const type = userType === 'user' ? UserType.User : UserType.Driver;

    const { person, accessToken, refreshToken } = await this.authService.signIn(body, type);
    response.cookie('refreshToken', refreshToken);

    const result = type === UserType.User ? { user: person, accessToken } : { driver: person, accessToken };
    return result;
  }

  @Get('me')
  @UseGuards(AccessTokenGuard)
  @ApiOperation({ summary: '로그인 유저 정보 조회' })
  async getMe() {
    const person = await this.authService.getMe();

    return person;
  }

  @Post('refresh')
  @UseGuards(RefreshTokenGuard)
  @ApiOperation({ summary: '토큰 재발급' })
  async refreshToken(@Res({ passthrough: true }) response: Response) {
    const { person, accessToken, refreshToken, type } = await this.authService.getNewToken();
    response.cookie('refreshToken', refreshToken);

    const result = type === UserType.User ? { user: person, accessToken } : { driver: person, accessToken };
    return result;
  }
}

import { AuthService } from '#auth/auth.service.js';
import { GoogleAuthType, SignInDTO, SignUpDTO, SignUpDTOWithoutHash } from '#auth/auth.types.js';
import { IAuthController } from '#auth/interfaces/auth.controller.interface.js';
import { BadRequestException } from '#exceptions/http.exception.js';
import { EnumValidationPipe } from '#global/pipes/enum.validation.pipe.js';
import { AccessTokenGuard } from '#guards/access-token.guard.js';
import { HashPasswordGuard } from '#guards/hash-password.guard.js';
import { RefreshTokenGuard } from '#guards/refresh-token.guard.js';
import { UserType } from '#types/common.types.js';
import { Body, Controller, Get, Param, Post, Req, Res, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBody, ApiExcludeEndpoint, ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';

@ApiTags('auth')
@Controller('auth')
export class AuthController implements IAuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signUp/:userType')
  @UseGuards(HashPasswordGuard)
  @ApiOperation({ summary: '회원가입' })
  @ApiBody({ type: SignUpDTOWithoutHash })
  @ApiParam({ name: 'userType', enum: UserType })
  async signUp(
    @Body() body: SignUpDTO,
    @Param('userType', new EnumValidationPipe(UserType)) type: UserType,
    @Res({ passthrough: true }) response: Response,
  ) {
    const { person, accessToken, refreshToken } = await this.authService.createPerson(body, type);
    response.cookie('refreshToken', refreshToken);

    const result = type === UserType.User ? { user: person, accessToken } : { driver: person, accessToken };
    return result;
  }

  @Post('signIn/:userType')
  @ApiOperation({ summary: '로그인' })
  async signIn(@Body() body: SignInDTO, @Param('userType') userType: UserType, @Res({ passthrough: true }) response: Response) {
    if (!Object.values(UserType).includes(userType)) {
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

  @Get('google/user')
  @UseGuards(AuthGuard('google/user'))
  @ApiOperation({ summary: '구글 유저 로그인' })
  async googleUserAuth() {}

  @Get('google/driver')
  @UseGuards(AuthGuard('google/driver'))
  @ApiOperation({ summary: '구글 기사 로그인' })
  async googleDriverAuth() {}

  @Get('oauth2/redirect/google/user')
  @ApiExcludeEndpoint()
  @UseGuards(AuthGuard('google/user'))
  async googleUserAuthRedirect(@Req() req, @Res({ passthrough: true }) response: Response) {
    const redirectResult: GoogleAuthType = req.user;

    const { person, accessToken, refreshToken } = await this.authService.googleAuth(redirectResult, UserType.User);
    response.cookie('refreshToken', refreshToken);

    return { user: person, accessToken };
  }

  @Get('oauth2/redirect/google/driver')
  @ApiExcludeEndpoint()
  @UseGuards(AuthGuard('google/driver'))
  async googleDriverAuthRedirect(@Req() req, @Res({ passthrough: true }) response: Response) {
    const redirectResult: GoogleAuthType = req.user;

    const { person, accessToken, refreshToken } = await this.authService.googleAuth(redirectResult, UserType.Driver);
    response.cookie('refreshToken', refreshToken);

    return { driver: person, accessToken };
  }
}

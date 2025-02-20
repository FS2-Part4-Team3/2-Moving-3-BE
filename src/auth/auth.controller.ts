import { AuthService } from '#auth/auth.service.js';
import { IAuthController } from '#auth/interfaces/auth.controller.interface.js';
import { LoggedInUsersDTO } from '#auth/types/auth.dto.js';
import { FilteredDriverOutputDTO } from '#auth/types/filtered.driver.dto.js';
import { FilteredUserOutputDTO } from '#auth/types/filtered.user.dto.js';
import { SocialAuthType } from '#auth/types/provider.types.js';
import { SignInDTO, SignUpDTO } from '#auth/types/sign.dto.js';
import { UpdatePasswordDTO } from '#auth/types/update-password.dto.js';
import { oauthRedirect } from '#configs/common.config.js';
import { BadRequestException } from '#exceptions/http.exception.js';
import { EnumValidationPipe } from '#global/pipes/enum.validation.pipe.js';
import { AccessTokenGuard } from '#guards/access-token.guard.js';
import { GuardService } from '#guards/guard.service.js';
import { HashPasswordGuard } from '#guards/hash-password.guard.js';
import { RefreshTokenGuard } from '#guards/refresh-token.guard.js';
import { UserType } from '#types/common.types.js';
import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Patch, Post, Req, Res, UseGuards } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { AuthGuard } from '@nestjs/passport';
import {
  ApiBearerAuth,
  ApiCookieAuth,
  ApiExcludeEndpoint,
  ApiOperation,
  ApiParam,
  ApiResponse,
  getSchemaPath,
} from '@nestjs/swagger';
import { Response } from 'express';

@Controller('auth')
export class AuthController implements IAuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
    private readonly guardService: GuardService,
  ) {}

  private setAccessToken(res: Response, token: string) {
    const maxAge = token ? 1000 * 60 * 60 : 0;

    res.cookie('accessToken', token, {
      // httpOnly: true,
      secure: true,
      sameSite: 'none',
      maxAge,
    });

    res.setHeader('Authorization', `Bearer ${token}`);
  }

  private setRefreshToken(res: Response, token: string) {
    const maxAge = token ? 1000 * 60 * 60 * 24 * 14 : 0;

    res.cookie('refreshToken', token, {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      maxAge,
    });
  }

  @Post('signUp/:userType')
  @UseGuards(HashPasswordGuard)
  @ApiOperation({ summary: '회원가입' })
  @ApiParam({ name: 'userType', enum: UserType })
  @ApiResponse({
    status: HttpStatus.CREATED,
    schema: {
      type: 'object',
      properties: {
        person: { oneOf: [{ $ref: getSchemaPath(FilteredUserOutputDTO) }, { $ref: getSchemaPath(FilteredDriverOutputDTO) }] },
        accessToken: { type: 'string' },
      },
    },
  })
  async signUp(
    @Body() body: SignUpDTO,
    @Param('userType', new EnumValidationPipe(UserType)) type: UserType,
    @Res({ passthrough: true }) response: Response,
  ) {
    const { person, accessToken, refreshToken } = await this.authService.createPerson(body, type);
    // this.setAccessToken(response, accessToken);
    // this.setRefreshToken(response, refreshToken);

    return { person, accessToken };
  }

  @Patch('password')
  @UseGuards(HashPasswordGuard, AccessTokenGuard)
  @ApiOperation({ summary: '비밀번호 변경' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    schema: {
      type: 'object',
      properties: {
        person: { oneOf: [{ $ref: getSchemaPath(FilteredUserOutputDTO) }, { $ref: getSchemaPath(FilteredDriverOutputDTO) }] },
        accessToken: { type: 'string' },
      },
    },
  })
  async updatePassword(@Body() body: UpdatePasswordDTO, @Res({ passthrough: true }) response: Response) {
    const { person, accessToken, refreshToken } = await this.authService.updatePassword(body);
    this.setAccessToken(response, accessToken);
    this.setRefreshToken(response, refreshToken);

    return { person, accessToken };
  }

  @Post('signIn/:userType')
  @ApiOperation({ summary: '로그인' })
  @ApiParam({ name: 'userType', enum: UserType })
  @ApiResponse({
    status: HttpStatus.OK,
    schema: {
      type: 'object',
      properties: {
        person: { oneOf: [{ $ref: getSchemaPath(FilteredUserOutputDTO) }, { $ref: getSchemaPath(FilteredDriverOutputDTO) }] },
        accessToken: { type: 'string' },
      },
    },
  })
  async signIn(@Body() body: SignInDTO, @Param('userType') userType: UserType, @Res({ passthrough: true }) response: Response) {
    if (!Object.values(UserType).includes(userType)) {
      throw new BadRequestException();
    }
    const type = userType === 'user' ? UserType.User : UserType.Driver;

    const { person, accessToken, refreshToken } = await this.authService.signIn(body, type);
    this.setAccessToken(response, accessToken);
    this.setRefreshToken(response, refreshToken);

    return { person, accessToken };
  }

  @Delete('signOut')
  @UseGuards(AccessTokenGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: '로그아웃' })
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
  })
  async signOut(@Res({ passthrough: true }) response: Response) {
    await this.authService.signOut();
    this.setAccessToken(response, '');
    this.setRefreshToken(response, '');
  }

  @Get('me')
  @UseGuards(AccessTokenGuard)
  @ApiOperation({ summary: '로그인 유저 정보 조회' })
  @ApiBearerAuth('accessToken')
  @ApiResponse({
    status: HttpStatus.OK,
    schema: {
      oneOf: [{ $ref: getSchemaPath(FilteredUserOutputDTO) }, { $ref: getSchemaPath(FilteredDriverOutputDTO) }],
    },
  })
  async getMe() {
    const person = await this.authService.getMe();

    return person;
  }

  @Get('isLoggedIn')
  @ApiOperation({ summary: '로그인 상태 조회(본인)' })
  @ApiResponse({
    status: HttpStatus.OK,
    schema: {
      type: 'object',
      properties: {
        isAccessTokenValid: { type: 'boolean' },
        isRefreshTokenValid: { type: 'boolean' },
        userType: {
          type: 'string',
          enum: Object.values(UserType),
        },
      },
    },
  })
  async isLoggedIn(@Req() req) {
    let isAccessTokenValid = false;
    let isRefreshTokenValid = false;
    let userType = null;

    const accessToken = req.headers['authorization']?.split(' ')[1];
    const refreshToken = req.cookies['refreshToken'];

    if (accessToken) {
      const jwtSecret = this.configService.get('jwtSecret');
      const payload = await this.jwtService.verifyAsync(accessToken, { secret: jwtSecret });
      const person = await this.guardService.validatePerson(payload.id, payload.type);

      if (person) {
        isAccessTokenValid = true;
        userType = payload.type;
      }
    }

    if (refreshToken) {
      const jwtSecret = this.configService.get('jwtSecret');
      const payload = await this.jwtService.verifyAsync(refreshToken, { secret: jwtSecret });
      const person = await this.guardService.validatePerson(payload.id, payload.type);

      if (person && person.refreshToken === refreshToken) {
        isRefreshTokenValid = true;
      }
    }

    return { isAccessTokenValid, isRefreshTokenValid, userType };
  }

  @Get(':id/isOnline')
  @ApiOperation({ summary: '로그인 상태 조회(id)' })
  @ApiResponse({
    status: HttpStatus.OK,
    type: LoggedInUsersDTO,
  })
  async isOnline(@Param('id') id: string) {
    return await this.authService.findLoggedInUser(id);
  }

  @Post('refresh')
  @UseGuards(RefreshTokenGuard)
  @ApiOperation({ summary: '토큰 재발급' })
  @ApiCookieAuth('refreshToken')
  @ApiResponse({
    status: HttpStatus.OK,
    schema: {
      type: 'object',
      properties: {
        person: { oneOf: [{ $ref: getSchemaPath(FilteredUserOutputDTO) }, { $ref: getSchemaPath(FilteredDriverOutputDTO) }] },
        accessToken: { type: 'string' },
      },
    },
  })
  async refreshToken(@Res({ passthrough: true }) response: Response) {
    const { person, accessToken, refreshToken, type } = await this.authService.getNewToken();
    this.setAccessToken(response, accessToken);
    this.setRefreshToken(response, refreshToken);

    return { person, accessToken };
  }

  @Get('google/:userType')
  @UseGuards(AuthGuard('google'))
  @ApiOperation({ summary: '구글 로그인' })
  @ApiParam({ name: 'userType', enum: UserType })
  @ApiResponse({
    status: HttpStatus.FOUND,
    headers: {
      Location: {
        description: '구글 콜백 페이지에 액세스 토큰과 함께 리다이렉션',
        schema: { type: 'string', example: 'https://www.moving.wiki/callback/google?accessToken=TokenValue' },
      },
    },
  })
  async googleAuth() {}

  @Get('google/:userType/verify')
  @UseGuards(AuthGuard('googleVerify'))
  @ApiOperation({ summary: '구글 로그인 유저 인증' })
  @ApiParam({ name: 'userType', enum: UserType })
  @ApiResponse({
    status: HttpStatus.FOUND,
    headers: {
      Location: {
        description: '구글 콜백 페이지에 액세스 토큰과 함께 리다이렉션',
        schema: { type: 'string', example: 'https://www.moving.wiki/callback/google/verify?accessToken=TokenValue' },
      },
    },
  })
  async googleAuthVerify() {}

  @Get('oauth2/redirect/google')
  @ApiExcludeEndpoint()
  @UseGuards(AuthGuard('google'))
  async googleAuthRedirect(@Req() req, @Res({ passthrough: true }) response: Response) {
    const redirectResult: SocialAuthType = req.user;

    const { person, accessToken, refreshToken } = await this.authService.socialAuth(redirectResult);
    this.setAccessToken(response, accessToken);
    this.setRefreshToken(response, refreshToken);

    response.redirect(`${oauthRedirect}/callback/google?accessToken=${accessToken}`);
  }

  @Get('oauth2/redirect/google/verify')
  @ApiExcludeEndpoint()
  @UseGuards(AuthGuard('googleVerify'))
  async googleAuthVerifyRedirect(@Req() req, @Res({ passthrough: true }) response: Response) {
    const redirectResult: SocialAuthType = req.user;

    const { person, accessToken, refreshToken } = await this.authService.socialAuthVerify(redirectResult);
    this.setAccessToken(response, accessToken);
    this.setRefreshToken(response, refreshToken);

    response.redirect(`${oauthRedirect}/callback/google/verify?accessToken=${accessToken}`);
  }

  @Get('kakao/:userType')
  @UseGuards(AuthGuard('kakao'))
  @ApiOperation({ summary: '카카오 로그인' })
  @ApiParam({ name: 'userType', enum: UserType })
  @ApiResponse({
    status: HttpStatus.FOUND,
    headers: {
      Location: {
        description: '카카오 콜백 페이지에 액세스 토큰과 함께 리다이렉션',
        schema: { type: 'string', example: 'https://www.moving.wiki/callback/kakao?accessToken=TokenValue' },
      },
    },
  })
  async kakaoAuth() {}

  @Get('oauth2/redirect/kakao')
  @ApiExcludeEndpoint()
  @UseGuards(AuthGuard('kakao'))
  async kakaoAuthRedirect(@Req() req, @Res({ passthrough: true }) response: Response) {
    const redirectResult: SocialAuthType = req.user;

    const { person, accessToken, refreshToken } = await this.authService.socialAuth(redirectResult);
    this.setAccessToken(response, accessToken);
    this.setRefreshToken(response, refreshToken);

    response.redirect(`${oauthRedirect}/callback/kakao?accessToken=${accessToken}`);
  }

  @Get('naver/:userType')
  @UseGuards(AuthGuard('naver'))
  @ApiOperation({ summary: '네이버 로그인' })
  @ApiParam({ name: 'userType', enum: UserType })
  @ApiResponse({
    status: HttpStatus.FOUND,
    headers: {
      Location: {
        description: '네이버 콜백 페이지에 액세스 토큰과 함께 리다이렉션',
        schema: { type: 'string', example: 'https://www.moving.wiki/callback/naver?accessToken=TokenValue' },
      },
    },
  })
  async naverAuth() {}

  @Get('oauth2/redirect/naver')
  @ApiExcludeEndpoint()
  @UseGuards(AuthGuard('naver'))
  async naverAuthRedirect(@Req() req, @Res({ passthrough: true }) response: Response) {
    const redirectResult: SocialAuthType = req.user;

    const { person, accessToken, refreshToken } = await this.authService.socialAuth(redirectResult);
    this.setAccessToken(response, accessToken);
    this.setRefreshToken(response, refreshToken);

    response.redirect(`${oauthRedirect}/callback/naver?accessToken=${accessToken}`);
  }
}

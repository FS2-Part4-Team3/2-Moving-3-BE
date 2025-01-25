import { AuthService } from '#auth/auth.service.js';
import {
  FilteredDriverOutputDTO,
  FilteredUserOutputDTO,
  GoogleAuthType,
  SignInDTO,
  SignUpDTO,
  UpdatePasswordDTO,
} from '#auth/auth.types.js';
import { IAuthController } from '#auth/interfaces/auth.controller.interface.js';
import { BadRequestException } from '#exceptions/http.exception.js';
import { EnumValidationPipe } from '#global/pipes/enum.validation.pipe.js';
import { AccessTokenGuard } from '#guards/access-token.guard.js';
import { HashPasswordGuard } from '#guards/hash-password.guard.js';
import { RefreshTokenGuard } from '#guards/refresh-token.guard.js';
import { UserType } from '#types/common.types.js';
import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Patch, Post, Req, Res, UseGuards } from '@nestjs/common';
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
  constructor(private readonly authService: AuthService) {}

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
    this.setRefreshToken(response, refreshToken);

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
    this.setRefreshToken(response, refreshToken);

    return { person, accessToken };
  }

  @Delete('signOut')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: '로그아웃' })
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
  })
  async signOut(@Res({ passthrough: true }) response: Response) {
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

  @Get('oauth2/redirect/google')
  @ApiExcludeEndpoint()
  @UseGuards(AuthGuard('google'))
  async googleAuthRedirect(@Req() req, @Res({ passthrough: true }) response: Response) {
    const redirectResult: GoogleAuthType = req.user;

    const { person, accessToken, refreshToken } = await this.authService.googleAuth(redirectResult);
    this.setRefreshToken(response, refreshToken);

    response.redirect(`http://localhost:3000/callback/google?accessToken=${accessToken}`);
    // response.redirect(`https://www.moving.wiki/callback/google?accessToken=${accessToken}`);
  }
}

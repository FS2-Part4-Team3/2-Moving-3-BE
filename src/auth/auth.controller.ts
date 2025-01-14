import { AuthService } from '#auth/auth.service.js';
import { FilteredDriverOutputDTO, FilteredUserOutputDTO, SignInDTO, SignUpDTO, SignUpDTOWithoutHash } from '#auth/auth.types.js';
import { IAuthController } from '#auth/interfaces/auth.controller.interface.js';
import { BadRequestException } from '#exceptions/http.exception.js';
import { EnumValidationPipe } from '#global/pipes/enum.validation.pipe.js';
import { AccessTokenGuard } from '#guards/access-token.guard.js';
import { HashPasswordGuard } from '#guards/hash-password.guard.js';
import { RefreshTokenGuard } from '#guards/refresh-token.guard.js';
import { UserType } from '#types/common.types.js';
import { Body, Controller, Get, HttpStatus, Param, Post, Res, UseGuards } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiParam, ApiResponse, ApiTags, getSchemaPath } from '@nestjs/swagger';
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
    response.cookie('refreshToken', refreshToken);

    return { person, accessToken };
  }

  @Post('signIn/:userType')
  @ApiOperation({ summary: '로그인' })
  @ApiBody({ type: SignInDTO })
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
    response.cookie('refreshToken', refreshToken);

    return { person, accessToken };
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

    return { person, accessToken };
  }
}

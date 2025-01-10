import { AuthInvalidAccessTokenException, AuthInvalidTokenException } from '#auth/auth.exception.js';
import { InternalServerErrorException } from '#exceptions/http.exception.js';
import { GuardService } from '#guards/guard.service.js';
import { IStorage, UserType } from '#types/common.types.js';
import loggingError from '#utils/loggingError.js';
import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JsonWebTokenError, JwtService } from '@nestjs/jwt';
import { AsyncLocalStorage } from 'async_hooks';

@Injectable()
export class RefreshTokenGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly guardService: GuardService,
    private readonly als: AsyncLocalStorage<IStorage>,
    private readonly configService: ConfigService,
  ) {}

  async canActivate(context: ExecutionContext) {
    const jwtSecret = this.configService.get('jwtSecret');

    const request = context.switchToHttp().getRequest();
    // NOTE 중복 쿠키 거르는 작업
    // 쿠키가 이중으로 잡히는 경우가 있어서 사용함
    const cookies = request.headers.cookie.split(';');
    const tokens = cookies.filter(cookie => cookie.trim().startsWith('refreshToken=')).map(cookie => cookie.trim().split('=')[1]);
    const token = tokens[tokens.length - 1];
    if (!token) throw new UnauthorizedException();

    try {
      const payload = await this.jwtService.verifyAsync(token, { secret: jwtSecret });
      if (!payload.id || !payload.type) {
        throw new AuthInvalidAccessTokenException();
      }
      const person = await this.guardService.validatePerson(payload.id, payload.type);
      if (!person) {
        throw new AuthInvalidAccessTokenException();
      }

      const storage = this.als.getStore();
      storage.refreshToken = token;
      storage.type = payload.type;

      switch (payload.type) {
        case UserType.User:
          storage.userId = payload.id;
          storage.user = person;
          break;
        case UserType.Driver:
          storage.driverId = payload.id;
          storage.driver = person;
          break;
        default:
          throw new AuthInvalidTokenException();
      }
    } catch (err) {
      loggingError(err);
      if (err instanceof JsonWebTokenError) {
        throw new AuthInvalidTokenException();
      }

      throw new InternalServerErrorException();
    }

    return true;
  }
}

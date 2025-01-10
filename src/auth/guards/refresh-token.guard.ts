import { AuthInvalidRefreshTokenException, AuthInvalidTokenException } from '#auth/auth.exception.js';
import { GuardService } from '#auth/guard.service.js';
import { InternalServerErrorException } from '#exceptions/http.exception.js';
import { IStorage } from '#types/common.types.js';
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
      if (!payload.userId) {
        throw new AuthInvalidRefreshTokenException();
      }
      const user = await this.guardService.validateUser(payload.userId);
      if (!user) {
        throw new AuthInvalidRefreshTokenException();
      }

      const storage = this.als.getStore();
      Object.assign(storage, payload);
      storage.refreshToken = token;
      storage.user = user;
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

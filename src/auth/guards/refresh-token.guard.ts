import { IStorage } from '#types/common.types.js';
import logger from '#utils/logger.js';
import stringifyJson from '#utils/stringifyJson.js';
import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { AsyncLocalStorage } from 'async_hooks';

@Injectable()
export class RefreshTokenGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
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
      console.log('🚀 ~ RefreshTokenGuard ~ canActivate ~ payload:', payload);
      const storage = this.als.getStore();
      storage.refreshToken = token;
      Object.assign(storage, payload);
    } catch (err) {
      logger.error(`${err instanceof Error ? err : `Error: ` + stringifyJson(err)}`);
      if (err instanceof Error) logger.error(`${err.stack}`);
      throw new UnauthorizedException();
    }

    return true;
  }
}

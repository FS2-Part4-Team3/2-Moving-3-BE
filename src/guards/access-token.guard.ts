import { AuthInvalidAccessTokenException, AuthInvalidTokenException } from '#auth/auth.exception.js';
import { InternalServerErrorException, UnauthorizedException } from '#exceptions/http.exception.js';
import { GuardService } from '#guards/guard.service.js';
import { IStorage, UserType } from '#types/common.types.js';
import loggingError from '#utils/loggingError.js';
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JsonWebTokenError, JwtService } from '@nestjs/jwt';
import { AsyncLocalStorage } from 'async_hooks';
import { Request } from 'express';

@Injectable()
export class AccessTokenGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly guardService: GuardService,
    private readonly als: AsyncLocalStorage<IStorage>,
    private readonly configService: ConfigService,
  ) {}

  async canActivate(context: ExecutionContext) {
    const jwtSecret = this.configService.get('jwtSecret');

    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);
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
      storage.accessToken = token;
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

  private extractTokenFromHeader(request: Request) {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}

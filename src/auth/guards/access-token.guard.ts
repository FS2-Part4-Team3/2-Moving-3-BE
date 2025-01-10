import { AuthInvalidAccessTokenException, AuthInvalidTokenException } from '#auth/auth.exception.js';
import { InternalServerErrorException, UnauthorizedException } from '#exceptions/http.exception.js';
import { IStorage } from '#types/common.types.js';
import { UserRepository } from '#users/user.repository.js';
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
    private readonly userRepository: UserRepository,
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
      if (!payload.userId) {
        throw new AuthInvalidAccessTokenException();
      }
      const user = await this.userRepository.findById(payload.userId);
      if (!user) {
        throw new AuthInvalidAccessTokenException();
      }

      const storage = this.als.getStore();
      Object.assign(storage, payload);
      storage.accessToken = token;
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

  private extractTokenFromHeader(request: Request) {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}

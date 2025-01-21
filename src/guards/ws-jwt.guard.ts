import { WSInvalidTokenException, WSTokenNotFoundException } from '#exceptions/ws.exception.js';
import { GuardService } from '#guards/guard.service.js';
import { UserType } from '#types/common.types.js';
import { CustomSocket } from '#types/socket.type.js';
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class WsJwtGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly guardService: GuardService,
    private readonly configService: ConfigService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    try {
      const jwtSecret = this.configService.get('jwtSecret');
      const client: CustomSocket = context.switchToWs().getClient<CustomSocket>();
      const token = client.handshake.auth.token;

      if (!token) {
        throw new WSTokenNotFoundException();
      }

      const payload = await this.jwtService.verifyAsync(token, { secret: jwtSecret });
      if (!payload.id || !payload.type) {
        throw new WSInvalidTokenException();
      }

      const person = await this.guardService.validatePerson(payload.id, payload.type);
      if (!person) {
        throw new WSInvalidTokenException();
      }

      person.type = payload.type;
      client.type = payload.type;

      switch (payload.type) {
        case UserType.User:
          client.user = person;
          break;
        case UserType.Driver:
          client.driver = person;
          break;
        default:
          throw new WSInvalidTokenException();
      }

      return true;
    } catch (err) {
      throw new WSInvalidTokenException();
    }
  }
}

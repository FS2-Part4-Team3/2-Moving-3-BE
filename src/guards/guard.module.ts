import { DriverModule } from '#drivers/driver.module.js';
import { AccessTokenGuard } from '#guards/access-token.guard.js';
import { GuardService } from '#guards/guard.service.js';
import { HashPasswordGuard } from '#guards/hash-password.guard.js';
import { RefreshTokenGuard } from '#guards/refresh-token.guard.js';
import { WsJwtGuard } from '#guards/ws-jwt.guard.js';
import { UserModule } from '#users/user.module.js';
import { forwardRef, Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

const guards = [AccessTokenGuard, RefreshTokenGuard, HashPasswordGuard, WsJwtGuard];

@Module({
  imports: [forwardRef(() => UserModule), forwardRef(() => DriverModule)],
  providers: [JwtService, GuardService, ...guards],
  exports: [JwtService, GuardService, ...guards],
})
export class GuardModule {}

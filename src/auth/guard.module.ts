import { GuardService } from '#auth/guard.service.js';
import { UserModule } from '#users/user.module.js';
import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AccessTokenGuard } from './guards/access-token.guard.js';
import { HashPasswordGuard } from './guards/hash-password.guard.js';
import { RefreshTokenGuard } from './guards/refresh-token.guard.js';

const guards = [AccessTokenGuard, RefreshTokenGuard, HashPasswordGuard];

@Module({
  imports: [UserModule],
  providers: [JwtService, GuardService, ...guards],
  exports: [JwtService, GuardService, ...guards],
})
export class GuardModule {}

import { AuthController } from '#auth/auth.controller.js';
import { AuthService } from '#auth/auth.service.js';
import { GuardModule } from '#auth/guard.module.js';
import { AccessTokenGuard } from '#auth/guards/access-token.guard.js';
import { HashPasswordGuard } from '#auth/guards/hash-password.guard.js';
import { RefreshTokenGuard } from '#auth/guards/refresh-token.guard.js';
import { JwtGenerateService } from '#auth/jwt-generate.service.js';
import { UserModule } from '#users/user.module.js';
import { Module } from '@nestjs/common';

const guards = [AccessTokenGuard, RefreshTokenGuard, HashPasswordGuard];

@Module({
  imports: [UserModule, GuardModule],
  controllers: [AuthController],
  providers: [AuthService, JwtGenerateService],
  exports: [AuthService, JwtGenerateService],
})
export class AuthModule {}

import { AuthController } from '#auth/auth.controller.js';
import { AuthService } from '#auth/auth.service.js';
import { AccessTokenGuard } from '#auth/guards/access-token.guard.js';
import { HashPasswordGuard } from '#auth/guards/hash-password.guard.js';
import { RefreshTokenGuard } from '#auth/guards/refresh-token.guard.js';
import { JwtGenerateService } from '#auth/jwt-generate.service.js';
import { UserModule } from '#users/user.module.js';
import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

const guards = [AccessTokenGuard, RefreshTokenGuard, HashPasswordGuard];

@Module({
  imports: [UserModule],
  controllers: [AuthController],
  providers: [AuthService, JwtService, JwtGenerateService, ...guards],
  exports: [AuthService, JwtService, JwtGenerateService, ...guards],
})
export class AuthModule {}

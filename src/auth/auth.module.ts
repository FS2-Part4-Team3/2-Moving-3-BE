import { AuthController } from '#auth/auth.controller.js';
import { AuthService } from '#auth/auth.service.js';
import { JwtGenerateService } from '#auth/jwt-generate.service.js';
import { GoogleStrategy } from '#auth/strategies/google.strategy.js';
import { DriverModule } from '#drivers/driver.module.js';
import { GuardModule } from '#guards/guard.module.js';
import { UserModule } from '#users/user.module.js';
import { Module } from '@nestjs/common';
import { KakaoStrategy } from './strategies/kakao.strategy.js';

const strategies = [GoogleStrategy, KakaoStrategy];

@Module({
  imports: [UserModule, DriverModule, GuardModule],
  controllers: [AuthController],
  providers: [AuthService, JwtGenerateService, ...strategies],
  exports: [AuthService, JwtGenerateService],
})
export class AuthModule {}

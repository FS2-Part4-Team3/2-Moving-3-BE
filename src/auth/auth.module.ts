import { AuthController } from '#auth/auth.controller.js';
import { AuthRepository } from '#auth/auth.repository.js';
import { AuthService } from '#auth/auth.service.js';
import { JwtGenerateService } from '#auth/jwt-generate.service.js';
import { GoogleStrategy } from '#auth/strategies/google.strategy.js';
import { GoogleVerifyStrategy } from '#auth/strategies/google.strategy.verify.js';
import { DriverModule } from '#drivers/driver.module.js';
import { DBModule } from '#global/db.module.js';
import { GuardModule } from '#guards/guard.module.js';
import { UserModule } from '#users/user.module.js';
import { Module } from '@nestjs/common';
import { KakaoStrategy } from './strategies/kakao.strategy.js';
import { NaverStrategy } from './strategies/naver.strategy.js';

const strategies = [GoogleStrategy, KakaoStrategy, NaverStrategy, GoogleVerifyStrategy];

@Module({
  imports: [UserModule, DriverModule, GuardModule, DBModule],
  controllers: [AuthController],
  providers: [AuthService, AuthRepository, JwtGenerateService, ...strategies],
  exports: [AuthService, JwtGenerateService],
})
export class AuthModule {}

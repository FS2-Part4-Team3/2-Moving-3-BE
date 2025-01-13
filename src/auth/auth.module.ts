import { AuthController } from '#auth/auth.controller.js';
import { AuthService } from '#auth/auth.service.js';
import { JwtGenerateService } from '#auth/jwt-generate.service.js';
import { GoogleDriverStrategy } from '#auth/strategies/google.strategy.driver.js';
import { GoogleUserStrategy } from '#auth/strategies/google.strategy.user.js';
import { DriverModule } from '#drivers/driver.module.js';
import { GuardModule } from '#guards/guard.module.js';
import { UserModule } from '#users/user.module.js';
import { Module } from '@nestjs/common';

const strategies = [GoogleDriverStrategy, GoogleUserStrategy];

@Module({
  imports: [UserModule, DriverModule, GuardModule],
  controllers: [AuthController],
  providers: [AuthService, JwtGenerateService, ...strategies],
  exports: [AuthService, JwtGenerateService],
})
export class AuthModule {}

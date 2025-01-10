import { AuthController } from '#auth/auth.controller.js';
import { AuthService } from '#auth/auth.service.js';
import { JwtGenerateService } from '#auth/jwt-generate.service.js';
import { GuardModule } from '#guards/guard.module.js';
import { UserModule } from '#users/user.module.js';
import { Module } from '@nestjs/common';

@Module({
  imports: [UserModule, GuardModule],
  controllers: [AuthController],
  providers: [AuthService, JwtGenerateService],
  exports: [AuthService, JwtGenerateService],
})
export class AuthModule {}

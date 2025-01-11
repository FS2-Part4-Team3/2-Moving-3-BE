import { DBModule } from '#global/db.module.js';
import { GuardModule } from '#guards/guard.module.js';
import { UserController } from '#users/user.controller.js';
import { UserRepository } from '#users/user.repository.js';
import { UserService } from '#users/user.service.js';
import { forwardRef, Module } from '@nestjs/common';

@Module({
  imports: [DBModule, forwardRef(() => GuardModule)],
  controllers: [UserController],
  providers: [UserRepository, UserService],
  exports: [UserRepository, UserService],
})
export class UserModule {}

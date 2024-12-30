import { DBModule } from '#global/db.module.js';
import { UserController } from '#users/user.controller.js';
import { UserRepository } from '#users/user.repository.js';
import { UserService } from '#users/user.service.js';
import { Module } from '@nestjs/common';

@Module({
  imports: [DBModule],
  controllers: [UserController],
  providers: [UserRepository, UserService],
  exports: [UserRepository, UserService],
})
export class UserModule {}

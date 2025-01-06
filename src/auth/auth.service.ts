import { SignInDTO } from '#auth/auth.types.js';
import { IAuthService } from '#auth/interfaces/auth.service.interface.js';
import { IStorage } from '#types/common.types.js';
import { UserNotFoundException } from '#users/user.exception.js';
import { UserRepository } from '#users/user.repository.js';
import { UserInputDTO } from '#users/user.types.js';
import { Injectable } from '@nestjs/common';
import { AsyncLocalStorage } from 'async_hooks';

@Injectable()
export class AuthService implements IAuthService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly als: AsyncLocalStorage<IStorage>,
  ) {}

  async getMe() {
    const { userId } = this.als.getStore();
    const user = await this.userRepository.findById(userId);
    if (!user) throw new UserNotFoundException();

    return user;
  }

  async createUser(body: UserInputDTO) {}

  async signIn(body: SignInDTO) {}

  async getNewToken() {}
}

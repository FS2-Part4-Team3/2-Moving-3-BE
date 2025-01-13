import { ForbiddenException } from '#exceptions/http.exception.js';
import { IStorage } from '#types/common.types.js';
import { FindOptions } from '#types/options.type.js';
import { IUserService } from '#users/interfaces/user.service.interface.js';
import { UserNotFoundException } from '#users/user.exception.js';
import { UserRepository } from '#users/user.repository.js';
import { UserPatchDTO } from '#users/user.types.js';
import { Injectable } from '@nestjs/common';
import { AsyncLocalStorage } from 'async_hooks';

@Injectable()
export class UserService implements IUserService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly als: AsyncLocalStorage<IStorage>,
  ) {}

  async getUsers(options: FindOptions) {
    const totalCount = await this.userRepository.count();
    const list = await this.userRepository.findMany(options);

    return { totalCount, list };
  }

  async updateUser(id: string, body: UserPatchDTO) {
    const { userId } = this.als.getStore();
    if (id !== userId) {
      throw new ForbiddenException();
    }

    const target = await this.userRepository.findById(id);
    if (!target) {
      throw new UserNotFoundException();
    }

    const data = body;
    const user = await this.userRepository.update(id, data);

    return user;
  }
}

import { FindOptions } from '#types/options.type.js';
import { IUserService } from '#users/interfaces/user.service.interface.js';
import { UserNotFoundException } from '#users/user.exception.js';
import { UserRepository } from '#users/user.repository.js';
import { UserPatchDTO } from '#users/user.types.js';
import { Injectable } from '@nestjs/common';

@Injectable()
export class UserService implements IUserService {
  constructor(private readonly userRepository: UserRepository) {}

  async getUsers(options: FindOptions) {
    const totalCount = await this.userRepository.count();
    const list = await this.userRepository.findMany(options);

    return { totalCount, list };
  }

  async updateUser(id: string, body: UserPatchDTO) {
    const target = await this.userRepository.findById(id);
    if (!target) throw new UserNotFoundException();

    const data = body;
    const user = await this.userRepository.update(id, data);

    return user;
  }
}

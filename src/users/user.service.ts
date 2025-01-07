import { FindOptions } from '#types/options.type.js';
import { UserRepository } from '#users/user.repository.js';
import { Injectable } from '@nestjs/common';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  async getUsers(options: FindOptions) {
    const totalCount = await this.userRepository.count();
    const list = await this.userRepository.findMany(options);

    return { totalCount, list };
  }
}

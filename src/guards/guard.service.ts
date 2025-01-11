import { UserRepository } from '#users/user.repository.js';
import { Injectable } from '@nestjs/common';

@Injectable()
export class GuardService {
  constructor(private readonly userRepository: UserRepository) {}

  async validateUser(userId: string) {
    return this.userRepository.findById(userId);
  }
}

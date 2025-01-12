import { DriverRepository } from '#drivers/driver.repository.js';
import { InternalServerErrorException } from '#exceptions/http.exception.js';
import { UserType } from '#types/common.types.js';
import { UserRepository } from '#users/user.repository.js';
import { Injectable } from '@nestjs/common';

@Injectable()
export class GuardService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly driverRepository: DriverRepository,
  ) {}

  async validatePerson(id: string, type: UserType) {
    switch (type) {
      case UserType.User:
        return this.userRepository.findById(id);
      case UserType.Driver:
        return this.driverRepository.findById(id);
      default:
        throw new InternalServerErrorException();
    }
  }
}

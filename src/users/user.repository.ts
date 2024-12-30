import { PrismaService } from '#global/prisma.service.js';
import { FindOptions } from '#types/options.type.js';
import { IUserRepository } from '#users/interfaces/user.repository.interface.js';
import { UserInputDTO } from '#users/user.types.js';
import { Injectable } from '@nestjs/common';

@Injectable()
export class UserRepository implements IUserRepository {
  private readonly user;
  constructor(private readonly prisma: PrismaService) {
    this.user = prisma.user;
  }

  async findMany(options: FindOptions) {}

  async findById(id: string) {}

  async findByEmail(email: string) {}

  async findBySignInForm(body: UserInputDTO) {}

  async create(data: UserInputDTO) {}

  async update(id: string, data: UserInputDTO) {}
}

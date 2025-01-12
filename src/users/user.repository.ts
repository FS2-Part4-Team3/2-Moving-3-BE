import { SignUpDTO } from '#auth/auth.types.js';
import { PrismaService } from '#global/prisma.service.js';
import { FindOptions, SortOrder } from '#types/options.type.js';
import { IUserRepository } from '#users/interfaces/user.repository.interface.js';
import { UserUpdateDTO } from '#users/user.types.js';
import { Injectable } from '@nestjs/common';

@Injectable()
export class UserRepository implements IUserRepository {
  private readonly user;
  constructor(private readonly prisma: PrismaService) {
    this.user = prisma.user;
  }

  async count() {
    const count = await this.user.count();

    return count;
  }

  async findMany(options: FindOptions) {
    const { page, pageSize, orderBy } = options;
    // prettier-ignore
    const sort = (
      orderBy === SortOrder.Oldest ? {createdAt: 'asc'} :
      orderBy === SortOrder.Latest ? {createdAt: 'desc'} : {createdAt: 'desc'}
    )

    const users = await this.user.findMany({
      orderBy: sort,
      skip: (page - 1) * pageSize,
      take: pageSize,
    });

    return users;
  }

  async findById(id: string) {
    const user = await this.user.findUnique({ where: { id } });

    return user;
  }

  async findByEmail(email: string) {
    const user = await this.user.findUnique({ where: { email } });

    return user;
  }

  async create(data: SignUpDTO) {
    const user = await this.user.create({ data });

    return user;
  }

  async update(id: string, data: UserUpdateDTO) {
    const user = await this.user.update({ where: { id }, data });

    return user;
  }
}

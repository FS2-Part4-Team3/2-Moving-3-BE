import { IAuthRepository } from '#auth/interfaces/auth.repository.interface.js';
import { PrismaService } from '#global/prisma.service.js';

export class AuthRepository implements IAuthRepository {
  private readonly loggedInUsers;
  constructor(private readonly prisma: PrismaService) {
    this.loggedInUsers = prisma.loggedInUsers;
  }

  async findByLoginId(loginId: string) {
    return await this.loggedInUsers.findUnique({ where: { loginId } });
  }

  async upsert(loginId: string, refreshToken: string) {
    return await this.prisma.loggedInUsers.upsert({
      where: { loginId },
      update: { refreshToken },
      create: { loginId, refreshToken },
    });
  }
}

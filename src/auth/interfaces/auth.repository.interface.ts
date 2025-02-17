import { loggedInUsers } from '@prisma/client';

export interface IAuthRepository {
  findByLoginId(loginId: string): Promise<loggedInUsers>;
  upsert(loginId: string, refreshToken: string): Promise<loggedInUsers>;
}

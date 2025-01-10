import { SignUpDTO } from '#auth/auth.types.js';
import { FindOptions } from '#types/options.type.js';
import { User, UserUpdateDTO } from '#users/user.types.js';

export interface IUserRepository {
  count: () => Promise<number>;
  findMany: (option: FindOptions) => Promise<User[]>;
  findById: (id: string) => Promise<User> | null;
  findByEmail: (email: string) => Promise<User> | null;
  create: (data: SignUpDTO) => Promise<User>;
  update: (id: string, data: UserUpdateDTO) => Promise<User>;
}

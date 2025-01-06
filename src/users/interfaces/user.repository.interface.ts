import { FindOptions } from '#types/options.type.js';
import { User, UserCreateDTO } from '#users/user.types.js';

export interface IUserRepository {
  count: () => Promise<number>;
  findMany: (option: FindOptions) => Promise<User[]>;
  findById: (id: string) => Promise<User> | null;
  findByEmail: (email: string) => Promise<User> | null;
  create: (data: UserCreateDTO) => Promise<User>;
  update: (id: string, data: Partial<UserCreateDTO>) => void;
}

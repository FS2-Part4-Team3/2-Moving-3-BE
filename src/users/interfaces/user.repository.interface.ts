import { ProviderCreateDTO } from '#auth/types/provider.types.js';
import { SignUpDTO } from '#auth/types/sign.dto.js';
import { FindOptions } from '#types/options.type.js';
import { UserUpdateDTO } from '#users/types/user.dto.js';
import { User } from '#users/types/user.types.js';

export interface IUserRepository {
  count: () => Promise<number>;
  findMany: (option: FindOptions) => Promise<User[]>;
  findById: (id: string) => Promise<User> | null;
  findByEmail: (email: string) => Promise<User> | null;
  createBySignUp: (data: SignUpDTO) => Promise<User>;
  createByProviderCreateDTO: (data: ProviderCreateDTO) => Promise<User>;
  update: (id: string, data: UserUpdateDTO) => Promise<User>;
}

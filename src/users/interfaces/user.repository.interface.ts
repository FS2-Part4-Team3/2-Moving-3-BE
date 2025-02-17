import { ProviderCreateDTO } from '#auth/types/provider.types.js';
import { SignUpDTO } from '#auth/types/sign.dto.js';
import { FindOptions } from '#types/options.type.js';
import { UserUpdateDTO } from '#users/types/user.dto.js';
import { IUser } from '#users/types/user.types.js';

export interface IUserRepository {
  count: () => Promise<number>;
  findMany: (option: FindOptions) => Promise<IUser[]>;
  findById: (id: string) => Promise<IUser> | null;
  findByEmail: (email: string) => Promise<IUser> | null;
  createBySignUp: (data: SignUpDTO) => Promise<IUser>;
  createByProviderCreateDTO: (data: ProviderCreateDTO) => Promise<IUser>;
  update: (id: string, data: UserUpdateDTO) => Promise<IUser>;
}

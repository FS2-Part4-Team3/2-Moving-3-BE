import { FindOptions } from '#types/options.type.js';
import { User, UserCreateDTO, UserInputDTO } from '#users/user.types.js';

export interface IUserRepository {
  count: () => Promise<number>;
  findMany: (option: FindOptions) => void;
  findById: (id: string) => Promise<User> | null;
  findByEmail: (email: string) => void;
  findBySignInForm: (body: UserInputDTO) => void;
  create: (data: UserCreateDTO) => Promise<User>;
  update: (id: string, data: Partial<UserCreateDTO>) => void;
}

import { FindOptions } from '#types/options.type.js';
import { User, UserInputDTO } from '#users/user.types.js';

export interface IUserRepository {
  findMany: (option: FindOptions) => void;
  findById: (id: string) => Promise<User> | null;
  findByEmail: (email: string) => void;
  findBySignInForm: (body: UserInputDTO) => void;
  create: (data: UserInputDTO) => void;
  update: (id: string, data: UserInputDTO) => void;
}

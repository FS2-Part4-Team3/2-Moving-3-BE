import { FindOptions } from '#types/options.type.js';
import { User, UserPatchDTO } from '#users/user.types.js';

export interface IUserService {
  getUsers: (options: FindOptions) => Promise<{ totalCount: number; list: User[] }>;
  updateUser: (body: UserPatchDTO) => Promise<User>;
}

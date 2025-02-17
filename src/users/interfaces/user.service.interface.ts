import { FilteredPersonalInfo } from '#auth/types/filtered.types.js';
import { FindOptions } from '#types/options.type.js';
import { UserPatchDTO } from '#users/types/user.dto.js';
import { User } from '#users/types/user.types.js';

export interface IUserService {
  findUsers: (options: FindOptions) => Promise<{ totalCount: number; list: User[] }>;
  findUser: (id: string) => Promise<FilteredPersonalInfo<User>>;
  updateUser: (body: UserPatchDTO) => Promise<FilteredPersonalInfo<User>>;
}

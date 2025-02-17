import { FilteredPersonalInfo } from '#auth/types/filtered.types.js';
import { FindOptions } from '#types/options.type.js';
import { UserPatchDTO } from '#users/types/user.dto.js';
import { IUser } from '#users/types/user.types.js';

export interface IUserService {
  findUsers: (options: FindOptions) => Promise<{ totalCount: number; list: IUser[] }>;
  findUser: (id: string) => Promise<FilteredPersonalInfo<IUser>>;
  updateUser: (body: UserPatchDTO) => Promise<FilteredPersonalInfo<IUser>>;
}

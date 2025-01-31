import { FilteredPersonalInfo } from '#auth/types/filtered.types.js';
import { User, UserPatchDTO } from '#users/user.types.js';

export interface IUserController {
  patchUser: (body: UserPatchDTO) => Promise<FilteredPersonalInfo<User>>;
}

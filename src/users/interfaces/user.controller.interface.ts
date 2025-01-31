import { FilteredPersonalInfo } from '#auth/types/filtered.types.js';
import { UserPatchDTO } from '#users/types/user.dto.js';
import { User } from '#users/types/user.types.js';

export interface IUserController {
  patchUser: (body: UserPatchDTO) => Promise<FilteredPersonalInfo<User>>;
}

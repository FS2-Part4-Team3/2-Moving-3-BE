import { FilteredPersonalInfo } from '#types/personal.type.js';
import { User, UserPatchDTO } from '#users/user.types.js';

export interface IUserController {
  patchUser: (body: UserPatchDTO) => Promise<FilteredPersonalInfo<User>>;
}

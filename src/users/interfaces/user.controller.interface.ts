import { User, UserPatchDTO } from '#users/user.types.js';

export interface IUserController {
  patchUser: (body: UserPatchDTO) => Promise<User>;
}

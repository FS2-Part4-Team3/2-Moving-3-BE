import { User, UserPatchDTO } from '#users/user.types.js';

export interface IUserController {
  patchUser: (id: string, body: UserPatchDTO) => Promise<User>;
}

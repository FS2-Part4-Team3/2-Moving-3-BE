import { User, UserPatchDTO } from '#users/user.types.js';

export interface IUserController {
  watch: () => void;
  share: () => void;
  patchUser: (body: UserPatchDTO) => Promise<User>;
}

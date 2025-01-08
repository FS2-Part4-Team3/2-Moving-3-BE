import { User, UserPatchDTO } from '#users/user.types.js';

export interface IUserController {
  watch: () => void;
  share: () => void;
  patchUser: (id: string, body: UserPatchDTO) => Promise<User>;
}

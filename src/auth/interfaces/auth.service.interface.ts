import { FilteredUserWithToken, SignInDTO } from '#auth/auth.types.js';
import { FilteredPersonalInfo } from '#types/personal.type.js';
import { User, UserPostDTO } from '#users/user.types.js';

export interface IAuthService {
  getMe: () => Promise<FilteredPersonalInfo<User>>;
  createUser: (data: UserPostDTO) => Promise<FilteredUserWithToken>;
  signIn: (body: SignInDTO) => Promise<FilteredUserWithToken>;
  getNewToken: () => void;
}

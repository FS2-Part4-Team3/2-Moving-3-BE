import { FilteredUserWithToken, SignInDTO, SignUpDTO } from '#auth/auth.types.js';
import { FilteredPersonalInfo } from '#types/personal.type.js';
import { User } from '#users/user.types.js';

export interface IAuthService {
  getMe: () => Promise<FilteredPersonalInfo<User>>;
  createUser: (data: SignUpDTO) => Promise<FilteredUserWithToken>;
  signIn: (body: SignInDTO) => Promise<FilteredUserWithToken>;
  getNewToken: () => void;
}

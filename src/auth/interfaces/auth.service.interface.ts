import { FilteredUserOutputDTO, FilteredUserUserWithToken, SignInDTO } from '#auth/auth.types.js';
import { UserPostDTO } from '#users/user.types.js';

export interface IAuthService {
  getMe: () => Promise<FilteredUserOutputDTO>;
  createUser: (data: UserPostDTO) => Promise<FilteredUserUserWithToken>;
  signIn: (body: SignInDTO) => Promise<FilteredUserUserWithToken>;
  getNewToken: () => void;
}

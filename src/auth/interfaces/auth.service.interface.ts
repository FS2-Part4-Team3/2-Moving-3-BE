import { FilteredUserOutputDTO, FilteredUserUserWithToken, SignInDTO } from '#auth/auth.types.js';
import { UserInputDTO } from '#users/user.types.js';

export interface IAuthService {
  getMe: () => Promise<FilteredUserOutputDTO>;
  createUser: (data: UserInputDTO) => Promise<FilteredUserUserWithToken>;
  signIn: (body: SignInDTO) => Promise<FilteredUserUserWithToken>;
  getNewToken: () => void;
}

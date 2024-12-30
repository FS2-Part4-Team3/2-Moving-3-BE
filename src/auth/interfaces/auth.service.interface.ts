import { SignInDTO } from '#auth/auth.types.js';
import { UserInputDTO } from '#users/user.types.js';

export interface IAuthService {
  getMe: () => void;
  createUser: (body: UserInputDTO) => void;
  signIn: (body: SignInDTO) => void;
  getNewToken: () => void;
}

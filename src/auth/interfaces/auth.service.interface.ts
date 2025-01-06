import { SignInDTO } from '#auth/auth.types.js';
import { User, UserInputDTO } from '#users/user.types.js';

export interface IAuthService {
  getMe: () => Promise<User>;
  createUser: (body: UserInputDTO) => void;
  signIn: (body: SignInDTO) => void;
  getNewToken: () => void;
}

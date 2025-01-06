import { FilteredUserUserWithToken, SignInDTO } from '#auth/auth.types.js';
import { User, UserInputDTO } from '#users/user.types.js';
import { Response } from 'express';

export interface IAuthController {
  signUp: (body: UserInputDTO) => Promise<FilteredUserUserWithToken>;
  signIn: (body: SignInDTO, res: Response) => void;
  getMe: () => Promise<User>;
  refreshToken: () => void;
}

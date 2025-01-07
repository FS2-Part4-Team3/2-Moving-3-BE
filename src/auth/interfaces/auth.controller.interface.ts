import { FilteredUserUserWithToken, SignInDTO } from '#auth/auth.types.js';
import { User, UserInputDTO } from '#users/user.types.js';
import { Response } from 'express';

export interface IAuthController {
  signUp: (body: UserInputDTO, res: Response) => Promise<FilteredUserUserWithToken>;
  signIn: (body: SignInDTO, res: Response) => Promise<FilteredUserUserWithToken>;
  getMe: () => Promise<User>;
  refreshToken: (res: Response) => void;
}

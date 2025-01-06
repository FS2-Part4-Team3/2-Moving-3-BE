import { SignInDTO } from '#auth/auth.types.js';
import { User, UserInputDTO } from '#users/user.types.js';
import { Response } from 'express';

export interface IAuthController {
  signUp: (body: UserInputDTO) => void;
  signIn: (body: SignInDTO, res: Response) => void;
  getMe: () => Promise<User>;
  refreshToken: () => void;
}

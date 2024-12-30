import { SignInDTO } from '#auth/auth.types.js';
import { UserInputDTO } from '#users/user.types.js';
import { Response } from 'express';

export interface IAuthController {
  signUp: (body: UserInputDTO) => void;
  signIn: (body: SignInDTO, res: Response) => void;
  getMe: () => void;
  refreshToken: () => void;
}

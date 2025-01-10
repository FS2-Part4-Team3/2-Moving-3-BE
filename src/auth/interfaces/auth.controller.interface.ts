import { FilteredUserWithToken, SignInDTO } from '#auth/auth.types.js';
import { FilteredPersonalInfo, SignUpDTO } from '#types/personal.type.js';
import { User } from '#users/user.types.js';
import { Response } from 'express';

export interface IAuthController {
  signUp: (body: SignUpDTO, res: Response) => Promise<FilteredUserWithToken>;
  signIn: (body: SignInDTO, res: Response) => Promise<FilteredUserWithToken>;
  getMe: () => Promise<FilteredPersonalInfo<User>>;
  refreshToken: (res: Response) => void;
}

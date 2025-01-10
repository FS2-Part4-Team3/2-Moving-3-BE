import { FilteredPersonWithToken, SignInDTO, SignUpDTO } from '#auth/auth.types.js';
import { FilteredPersonalInfo } from '#types/personal.type.js';
import { User } from '#users/user.types.js';
import { Response } from 'express';

export interface IAuthController {
  signUp: (body: SignUpDTO, userType: 'user' | 'driver', res: Response) => Promise<FilteredPersonWithToken>;
  signIn: (body: SignInDTO, userType: 'user' | 'driver', res: Response) => Promise<FilteredPersonWithToken>;
  getMe: () => Promise<FilteredPersonalInfo<User>>;
  refreshToken: (res: Response) => void;
}

import { FilteredPersonWithToken, SignInDTO, SignUpDTO } from '#auth/auth.types.js';
import { UserType } from '#types/common.types.js';
import { FilteredPersonalInfo } from '#types/personal.type.js';
import { User } from '#users/user.types.js';
import { Response } from 'express';

export interface IAuthController {
  signUp: (body: SignUpDTO, userType: UserType, res: Response) => Promise<FilteredPersonWithToken>;
  signIn: (body: SignInDTO, userType: UserType, res: Response) => Promise<FilteredPersonWithToken>;
  getMe: () => Promise<FilteredPersonalInfo<User>>;
  refreshToken: (res: Response) => Promise<FilteredPersonWithToken>;
  googleAuth: () => void;
  googleAuthRedirect: (req: any, res: Response) => Promise<FilteredPersonWithToken>;
}

import { FilteredUserUserWithToken, SignInDTO } from '#auth/auth.types.js';
import { User, UserPostDTO } from '#users/user.types.js';
import { Response } from 'express';

export interface IAuthController {
  signUp: (body: UserPostDTO, res: Response) => Promise<FilteredUserUserWithToken>;
  signIn: (body: SignInDTO, res: Response) => Promise<FilteredUserUserWithToken>;
  getMe: () => Promise<User>;
  refreshToken: (res: Response) => void;
}

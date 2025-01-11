import { FilteredUserWithToken, SignInDTO } from '#auth/auth.types.js';
import { FilteredPersonalInfo } from '#types/personal.type.js';
import { User, UserPostDTO } from '#users/user.types.js';
import { Response } from 'express';

export interface IAuthController {
  signUp: (body: UserPostDTO, res: Response) => Promise<FilteredUserWithToken>;
  signIn: (body: SignInDTO, res: Response) => Promise<FilteredUserWithToken>;
  getMe: () => Promise<FilteredPersonalInfo<User>>;
  refreshToken: (res: Response) => void;
}

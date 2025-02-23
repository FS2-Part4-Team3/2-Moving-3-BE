import { FilteredPerson, FilteredPersonWithToken } from '#auth/types/filtered.types.js';
import { SignInDTO, SignUpDTO } from '#auth/types/sign.dto.js';
import { UserType } from '#types/common.types.js';
import { Response } from 'express';

export interface IAuthController {
  signUp: (body: SignUpDTO, userType: UserType, res: Response) => Promise<FilteredPersonWithToken>;
  signIn: (body: SignInDTO, userType: UserType, res: Response) => Promise<FilteredPersonWithToken>;
  getMe: () => Promise<FilteredPerson>;
  refreshToken: (res: Response) => Promise<FilteredPersonWithToken>;
  googleAuth: () => void;
  googleAuthRedirect: (req: any, res: Response) => void;
  kakaoAuth: (userType: UserType) => void;
  kakaoAuthRedirect: (req: any, res: Response) => void;
  naverAuth: (userType: UserType) => void;
  naverAuthRedirect: (req: any, res: Response) => void;
}

import {
  FilteredPerson,
  FilteredPersonWithToken,
  GoogleAuthType,
  KakaoAuthType,
  SignInDTO,
  SignUpDTO,
  UpdatePasswordDTO,
} from '#auth/auth.types.js';
import { UserType } from '#types/common.types.js';

export interface IAuthService {
  getMe: () => Promise<FilteredPerson>;
  createPerson: (data: SignUpDTO, type: UserType) => Promise<FilteredPersonWithToken>;
  updatePassword: (body: UpdatePasswordDTO) => Promise<FilteredPersonWithToken>;
  signIn: (body: SignInDTO, type: UserType) => Promise<FilteredPersonWithToken>;
  getNewToken: () => Promise<FilteredPersonWithToken>;
  googleAuth: (redirectResult: GoogleAuthType) => Promise<FilteredPersonWithToken>;
  kakaoAuth: (redirectResult: KakaoAuthType) => Promise<FilteredPersonWithToken>;
}

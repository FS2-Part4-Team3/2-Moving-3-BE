import { FilteredPerson, FilteredPersonWithToken } from '#auth/types/filtered.types.js';
import { GoogleAuthType, KakaoAuthType, NaverAuthType } from '#auth/types/provider.types.js';
import { SignInDTO, SignUpDTO } from '#auth/types/sign.dto.js';
import { UpdatePasswordDTO } from '#auth/types/update-password.dto.js';
import { UserType } from '#types/common.types.js';

export interface IAuthService {
  getMe: () => Promise<FilteredPerson>;
  createPerson: (data: SignUpDTO, type: UserType) => Promise<FilteredPersonWithToken>;
  updatePassword: (body: UpdatePasswordDTO) => Promise<FilteredPersonWithToken>;
  signIn: (body: SignInDTO, type: UserType) => Promise<FilteredPersonWithToken>;
  getNewToken: () => Promise<FilteredPersonWithToken>;
  googleAuth: (redirectResult: GoogleAuthType) => Promise<FilteredPersonWithToken>;
  kakaoAuth: (redirectResult: KakaoAuthType) => Promise<FilteredPersonWithToken>;
  naverAuth: (redirectResult: NaverAuthType) => Promise<FilteredPersonWithToken>;
}

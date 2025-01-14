import { FilteredPerson, FilteredPersonWithToken, SignInDTO, SignUpDTO } from '#auth/auth.types.js';
import { UserType } from '#types/common.types.js';

export interface IAuthService {
  getMe: () => Promise<FilteredPerson>;
  createPerson: (data: SignUpDTO, type: UserType) => Promise<FilteredPersonWithToken>;
  signIn: (body: SignInDTO, type: UserType) => Promise<FilteredPersonWithToken>;
  getNewToken: () => void;
}

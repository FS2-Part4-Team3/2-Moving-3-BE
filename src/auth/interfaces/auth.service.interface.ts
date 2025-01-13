import { FilteredPersonWithToken, GoogleAuthType, SignInDTO, SignUpDTO } from '#auth/auth.types.js';
import { Driver } from '#drivers/driver.types.js';
import { UserType } from '#types/common.types.js';
import { FilteredPersonalInfo } from '#types/personal.type.js';
import { User } from '#users/user.types.js';

export interface IAuthService {
  getMe: () => Promise<FilteredPersonalInfo<User> | FilteredPersonalInfo<Driver>>;
  createPerson: (data: SignUpDTO, type: UserType) => Promise<FilteredPersonWithToken>;
  signIn: (body: SignInDTO, type: UserType) => Promise<FilteredPersonWithToken>;
  getNewToken: () => Promise<FilteredPersonWithToken>;
  googleAuth: (redirectResult: GoogleAuthType, type: UserType) => Promise<FilteredPersonWithToken>;
}

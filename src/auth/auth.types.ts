import { FilteredPersonalInfo } from '#types/personal.type.js';
import { User } from '#users/user.types.js';

export interface UserToken {
  userId: string;
  exp: number;
  iat: number;
}

export interface SignInDTO extends Pick<User, 'email' | 'password'> {}

export interface FilteredUserWithToken {
  user: FilteredPersonalInfo<User>;
  accessToken: string;
  refreshToken?: string;
}

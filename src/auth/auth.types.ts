import { ModelBase } from '#types/common.types.js';
import { FilteredPersonalInfo } from '#types/personal.type.js';
import { User, UserPostDTO } from '#users/user.types.js';

export interface UserToken {
  userId: string;
  exp: number;
  iat: number;
}

export interface SignInDTO extends Pick<User, 'email' | 'password'> {}
export interface FilteredUserOutputDTO extends Omit<UserPostDTO, 'password' | 'salt' | 'refreshToken'>, ModelBase {}

export interface FilteredUserWithToken {
  user: FilteredPersonalInfo<User>;
  accessToken: string;
  refreshToken?: string;
}

import { ModelBase } from '#types/common.types.js';
import { User, UserInputDTO } from '#users/user.types.js';

export interface UserToken {
  userId: string;
  exp: number;
  iat: number;
}

export interface SignInDTO extends Pick<User, 'email' | 'password'> {}
export interface FilteredUserOutputDTO extends Omit<UserInputDTO, 'password' | 'salt' | 'refreshToken'>, ModelBase {}

export interface FilteredUserUserWithToken {
  user: FilteredUserOutputDTO;
  accessToken?: string;
  refreshToken?: string;
}

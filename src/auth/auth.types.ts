import { UserType } from '#types/common.types.js';
import { FilteredPersonalInfo } from '#types/personal.type.js';
import { User } from '#users/user.types.js';
import { IsEmail, IsHexadecimal, IsNotEmpty, IsString, Length, Matches } from 'class-validator';

export interface TokenPayload {
  id: string;
  type: UserType;
}

export interface SignInDTO extends Pick<User, 'email' | 'password'> {}

export class SignUpDTO {
  @IsEmail({}, { message: '이메일 형식 입력이 필요합니다.' })
  email: string;

  @IsString({ message: '이름은 문자열 형식입니다.' })
  @IsNotEmpty({ message: '이름은 1글자 이상이어야 합니다.' })
  name: string;

  @IsHexadecimal()
  @Length(128, 128)
  password: string;

  @IsHexadecimal()
  @Length(32, 32)
  salt: string;

  @Matches(/(010)-\d{3,4}-\d{4}/, { message: '010으로 시작하는 휴대전화 번호를 입력해주세요.' })
  phoneNumber: string;
}

export interface FilteredUserWithToken {
  user: FilteredPersonalInfo<User>;
  accessToken: string;
  refreshToken?: string;
}

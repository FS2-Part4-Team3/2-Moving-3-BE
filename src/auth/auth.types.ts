import { Driver } from '#drivers/driver.types.js';
import { UserType } from '#types/common.types.js';
import { FilteredPersonalInfo } from '#types/personal.type.js';
import { User } from '#users/user.types.js';
import { ApiProperty, OmitType } from '@nestjs/swagger';
import { IsEmail, IsHexadecimal, IsNotEmpty, IsString, Length, Matches } from 'class-validator';

export interface TokenPayload {
  id: string;
  type: UserType;
}

export interface SignInDTO extends Pick<User, 'email' | 'password'> {}

export class SignUpDTO {
  @ApiProperty({ description: '이메일' })
  @IsEmail({}, { message: '이메일 형식 입력이 필요합니다.' })
  email: string;

  @ApiProperty({ description: '이름' })
  @IsString({ message: '이름은 문자열 형식입니다.' })
  @IsNotEmpty({ message: '이름은 1글자 이상이어야 합니다.' })
  name: string;

  @IsHexadecimal()
  @Length(128, 128)
  password: string;

  @IsHexadecimal()
  @Length(32, 32)
  salt: string;

  @ApiProperty({ description: '전화번호' })
  @Matches(/(010)-\d{3,4}-\d{4}/, { message: '010으로 시작하는 휴대전화 번호를 입력해주세요.' })
  phoneNumber: string;
}

export type FilteredPersonWithToken = {
  accessToken: string;
  refreshToken?: string;
} & (
  | { person: FilteredPersonalInfo<User> | FilteredPersonalInfo<Driver> }
  | { user: FilteredPersonalInfo<User> }
  | { driver: FilteredPersonalInfo<Driver> }
);

export class SignUpDTOWithoutHash extends OmitType(SignUpDTO, ['password', 'salt']) {
  @ApiProperty({ description: '비밀번호' })
  password: string;
}

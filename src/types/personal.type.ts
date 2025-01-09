import { Driver } from '#drivers/driver.types.js';
import { User } from '#users/user.types.js';
import { IsEmail, IsHexadecimal, IsJWT, IsNotEmpty, IsOptional, IsString, IsUrl, Length, Matches } from 'class-validator';

export class PersonalInfo {
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

  @IsOptional()
  @IsUrl({}, { message: '올바른 이미지 주소를 입력해주세요.' })
  image: string;

  @IsOptional()
  @IsJWT({ message: 'refreshToken은 JWT 형식이어야 합니다.' })
  refreshToken: string;
}

export type FilteredPersonalInfo<T> = T extends User | Driver ? Omit<T, 'password' | 'salt' | 'refreshToken'> : never;

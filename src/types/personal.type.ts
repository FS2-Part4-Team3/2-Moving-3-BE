import { SignUpDTO } from '#auth/auth.types.js';
import { Driver } from '#drivers/driver.types.js';
import { User } from '#users/user.types.js';
import { IsJWT, IsOptional, IsUrl } from 'class-validator';

export class PersonalInfo extends SignUpDTO {
  @IsOptional()
  @IsUrl({}, { message: '올바른 이미지 주소를 입력해주세요.' })
  image: string;

  @IsOptional()
  @IsJWT({ message: 'refreshToken은 JWT 형식이어야 합니다.' })
  refreshToken: string;
}

export type FilteredPersonalInfo<T> = T extends User | Driver ? Omit<T, 'password' | 'salt' | 'refreshToken'> : never;

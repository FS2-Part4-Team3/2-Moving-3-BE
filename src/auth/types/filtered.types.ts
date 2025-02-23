import { imageRegex, Tokens } from '#auth/types/auth.types.js';
import { SignUpDTO } from '#auth/types/sign.dto.js';
import { IDriver } from '#drivers/types/driver.types.js';
import { IUser } from '#users/types/user.types.js';
import { ApiProperty, OmitType } from '@nestjs/swagger';
import { IsJWT, IsOptional, Matches } from 'class-validator';

export type FilteredPersonalInfo<T> = T extends IUser | IDriver ? Omit<T, 'password' | 'salt' | 'refreshToken'> : never;

export type FilteredPerson = FilteredPersonalInfo<IUser> | FilteredPersonalInfo<IDriver>;
export interface FilteredPersonWithToken extends Tokens {
  person: FilteredPerson;
}

export class PersonalInfo extends OmitType(SignUpDTO, ['password', 'salt']) {
  @IsOptional()
  @Matches(imageRegex, { message: '올바른 이미지 형식을 입력해주세요.' })
  @ApiProperty({ description: '프로필 사진' })
  image: string;

  @IsOptional()
  @IsJWT({ message: 'refreshToken은 JWT 형식이어야 합니다.' })
  refreshToken: string;
}

import { Driver } from '#drivers/driver.types.js';
import { UserType } from '#types/common.types.js';
import { FilteredPersonalInfo } from '#types/personal.type.js';
import { User } from '#users/user.types.js';
import { ApiProperty, OmitType } from '@nestjs/swagger';
import { Area, ServiceType } from '@prisma/client';
import { IsEmail, IsEnum, IsNotEmpty, IsString, Matches } from 'class-validator';

export interface TokenPayload {
  id: string;
  type: UserType;
}

export class Tokens {
  accessToken: string;
  refreshToken?: string;
}

export class SignInDTO {
  @ApiProperty({ description: '이메일' })
  email: string;
  @ApiProperty({ description: '비밀번호' })
  password: string;
}

export class SignUpDTO {
  @ApiProperty({ description: '이메일' })
  @IsEmail({}, { message: '이메일 형식 입력이 필요합니다.' })
  email: string;

  @ApiProperty({ description: '이름' })
  @IsString({ message: '이름은 문자열 형식입니다.' })
  @IsNotEmpty({ message: '이름은 1글자 이상이어야 합니다.' })
  name: string;

  @ApiProperty({ description: '비밀번호' })
  password: string;
  salt?: string;

  @ApiProperty({ description: '전화번호' })
  @Matches(/(010)-\d{3,4}-\d{4}/, { message: '010으로 시작하는 휴대전화 번호를 입력해주세요.' })
  phoneNumber: string;
}

export class SignUpDTOWithoutHash extends OmitType(SignUpDTO, ['password', 'salt']) {
  @ApiProperty({ description: '비밀번호' })
  password: string;
}

export class UpdatePasswordDTO {
  @ApiProperty({ description: '기존 비밀번호' })
  oldPw: string;
  oldSalt?: string;

  @ApiProperty({ description: '새 비밀번호' })
  newPw: string;
  newSalt?: string;
}

export class UpdatePasswordDTOWithoutHash extends OmitType(UpdatePasswordDTO, ['oldPw', 'oldSalt', 'newPw', 'newSalt']) {
  @ApiProperty({ description: '기존 비밀번호' })
  oldPw: string;

  @ApiProperty({ description: '새 비밀번호' })
  newPw: string;
}

export type FilteredPerson = FilteredPersonalInfo<User> | FilteredPersonalInfo<Driver>;

export interface FilteredPersonWithToken extends Tokens {
  person: FilteredPerson;
}

export class FilteredUserOutputDTO {
  @ApiProperty({ description: '이메일' })
  email: string;

  @ApiProperty({ description: '이름' })
  name: string;

  @ApiProperty({ description: '프로필 사진' })
  image?: string;

  @ApiProperty({ description: '전화번호' })
  phoneNumber?: string;

  @ApiProperty({ description: '서비스 타입' })
  serviceTypes: ServiceType[];

  @ApiProperty({ description: '이용 지역' })
  areas: Area[];

  @ApiProperty({ description: '소셜 로그인 프로바이더' })
  provider?: string;

  @ApiProperty({ description: '프로바이더 아이디' })
  providerId?: string;
}

export class FilteredDriverOutputDTO {
  @ApiProperty({ description: '이메일' })
  email: string;

  @ApiProperty({ description: '이름' })
  name: string;

  @ApiProperty({ description: '닉네임' })
  nickname?: string;

  @ApiProperty({ description: '프로필 사진' })
  image?: string;

  @ApiProperty({ description: '전화번호' })
  phoneNumber?: string;

  @ApiProperty({ description: '자기소개' })
  introduce?: string;

  @ApiProperty({ description: '상세 설명' })
  description?: string;

  @ApiProperty({ description: '서비스 타입' })
  serviceTypes: ServiceType[];

  @ApiProperty({ description: '서비스 가능 지역' })
  availableAreas: Area[];

  @ApiProperty({ description: '확정 회수' })
  applyCount: number;

  @ApiProperty({ description: '찜하기 회수' })
  likeCount: number;

  @ApiProperty({ description: '경력 시작일' })
  startAt: Date;

  @ApiProperty({ description: '경력 년수' })
  career: number;
}

export class UserTypeParamDTO {
  @IsEnum(UserType, { message: '사용자 형식은 user 혹은 driver 중 하나입니다.' })
  type: UserType;
}

export interface GoogleAuthType {
  email: string;
  name: string;
  photo: string;
  provider: string;
  id: string;
  userType: UserType;
  accessToken?: string;
  refreshToken?: string;
}

export interface GoogleCreateDTO {
  email: string;
  name: string;
  image: string;
  provider: string;
  providerId: string;
}

export interface ProviderInfo {
  provider: string;
  providerId: string;
}

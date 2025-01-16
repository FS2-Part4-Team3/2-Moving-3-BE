import { ProviderInfo } from '#auth/auth.types.js';
import { ModelBase } from '#types/common.types.js';
import { PersonalInfo } from '#types/personal.type.js';
import { ApiProperty, OmitType, PartialType } from '@nestjs/swagger';
import { $Enums, User as PrismaUser } from '@prisma/client';
import { ArrayNotEmpty, IsIn } from 'class-validator';

interface PrismaUserBase extends Omit<PrismaUser, keyof ModelBase> {}
interface UserBase extends PrismaUserBase {}

export interface User extends UserBase, ModelBase {}

export class UserEntity extends PersonalInfo {
  @ArrayNotEmpty({ message: '하나 이상의 지역을 선택해주세요' })
  @IsIn(Object.values($Enums.Area), { each: true, message: '올바른 지역을 선택해주세요.' })
  @ApiProperty({ description: '이용 지역' })
  areas: $Enums.Area[];

  @ArrayNotEmpty({ message: '하나 이상의 타입을 선택해주세요' })
  @IsIn(Object.values($Enums.ServiceType), { each: true, message: '올바른 지역을 선택해주세요.' })
  @ApiProperty({ description: '서비스 타입' })
  serviceType: $Enums.ServiceType[];
}

export class UserPatchDTO extends PartialType(OmitType(UserEntity, ['refreshToken', 'password'])) {}
export interface UserUpdateDTO extends Partial<Omit<User, keyof (ModelBase & ProviderInfo)>> {}

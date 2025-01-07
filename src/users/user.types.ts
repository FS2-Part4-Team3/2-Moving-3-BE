import { ModelBase } from '#types/common.types.js';
import { PersonalInfo } from '#types/personal.type.js';
import { OmitType } from '@nestjs/swagger';
import { $Enums, User as PrismaUser } from '@prisma/client';
import { ArrayNotEmpty, IsIn } from 'class-validator';

interface PrismaUserBase extends Omit<PrismaUser, keyof ModelBase> {}
interface UserBase extends PrismaUserBase {}

export interface User extends UserBase, ModelBase {}

export class UserEntity extends PersonalInfo implements User {
  @ArrayNotEmpty({ message: '하나 이상의 지역을 선택해주세요' })
  @IsIn(Object.values($Enums.Area), { each: true })
  areas: $Enums.Area[];

  @ArrayNotEmpty({ message: '하나 이상의 타입을 선택해주세요' })
  @IsIn(Object.values($Enums.ServiceType), { each: true })
  serviceTypes: $Enums.ServiceType[];
}

export class UserInputDTO extends OmitType(UserEntity, ['refreshToken']) {}
export interface UserCreateDTO extends Omit<Omit<User, keyof ModelBase>, 'refreshToken'> {}
export interface UserUpdateDTO extends Partial<UserCreateDTO> {
  refreshToken?: string;
}

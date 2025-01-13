import { ModelBase } from '#types/common.types.js';
import { PersonalInfo } from '#types/personal.type.js';
import { OmitType, PartialType } from '@nestjs/swagger';
import { $Enums, Driver as PrismaDriver } from '@prisma/client';
import { ArrayNotEmpty, IsIn, IsNotEmpty, IsString } from 'class-validator';

interface PrismaDriverBase extends Omit<PrismaDriver, keyof ModelBase> {}
interface DriverBase extends PrismaDriverBase {}

export interface Driver extends DriverBase, ModelBase {}

export class DriverEntity extends PersonalInfo {
  @IsString({ message: '별명은 문자열 형식입니다.' })
  @IsNotEmpty({ message: '별명은 1글자 이상이어야 합니다.' })
  nickname: string;

  @IsString({ message: '자기소개는 문자열 형식입니다.' })
  @IsNotEmpty({ message: '자기소개는 1글자 이상이어야 합니다.' })
  introduce: string;

  @IsString({ message: '상세 정보는 문자열 형식입니다.' })
  @IsNotEmpty({ message: '상세 정보는 1글자 이상이어야 합니다.' })
  description: string;

  @ArrayNotEmpty({ message: '하나 이상의 지역을 선택해주세요' })
  @IsIn(Object.values($Enums.Area), { each: true })
  availableAreas: $Enums.Area[];

  @ArrayNotEmpty({ message: '하나 이상의 타입을 선택해주세요' })
  @IsIn(Object.values($Enums.ServiceType), { each: true })
  serviceTypes: $Enums.ServiceType[];
}

export class DriverPatchDTO extends PartialType(OmitType(DriverEntity, ['refreshToken'])) {}
export interface DriverUpdateDTO extends Partial<Omit<Driver, keyof ModelBase>> {}

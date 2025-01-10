import { ModelBase } from '#types/common.types.js';
import { PersonalInfo } from '#types/personal.type.js';
import { $Enums, Driver as PrismaDriver } from '@prisma/client';
import { ArrayNotEmpty, IsIn, IsString } from 'class-validator';

interface PrismaDriverBase extends Omit<PrismaDriver, keyof ModelBase> {}
interface DriverBase extends PrismaDriverBase {}

export interface Driver extends DriverBase, ModelBase {}

export class DriverEntity extends PersonalInfo implements Omit<Driver, 'applyCount' | 'likeCount'> {
  @IsString()
  nickname: string;

  @IsString()
  introduce: string;

  @IsString()
  description: string;

  @ArrayNotEmpty({ message: '하나 이상의 지역을 선택해주세요' })
  @IsIn(Object.values($Enums.Area), { each: true })
  availableAreas: $Enums.Area[];

  @ArrayNotEmpty({ message: '하나 이상의 타입을 선택해주세요' })
  @IsIn(Object.values($Enums.ServiceType), { each: true })
  serviceTypes: $Enums.ServiceType[];
}

export interface DriverInputDTO extends Omit<Driver, keyof ModelBase> {}

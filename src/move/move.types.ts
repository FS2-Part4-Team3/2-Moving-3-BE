import { ModelBase } from '#types/common.types.js';
import { MoveInfo as PrismaMoveInfo, Progress, ServiceType } from '@prisma/client';
import { IsEnum, IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';
import { Type } from 'class-transformer';

interface PrismaMoveInfoBase extends Omit<PrismaMoveInfo, keyof ModelBase> {}
interface MoveInfoBase extends PrismaMoveInfoBase {}

export interface MoveInfo extends MoveInfoBase, ModelBase {}

export interface MoveInfoInputDTO extends Omit<MoveInfo, keyof ModelBase> {}

export class MoveInfoInputDTO {
  @IsNotEmpty()
  @IsEnum(ServiceType)
  ServiceType: ServiceType;

  @IsNotEmpty()
  @Type(() => Date)
  date: Date;

  @IsNotEmpty()
  @IsString()
  fromAddress: string;

  @IsNotEmpty()
  @IsString()
  toAddress: string;

  @IsNotEmpty()
  @IsEnum(Progress) 
  progress: Progress;

  @IsNotEmpty()
  @IsUUID()
  ownerId: string;
}


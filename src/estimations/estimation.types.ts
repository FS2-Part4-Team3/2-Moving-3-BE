import { ModelBase } from '#types/common.types.js';
import { Estimation as PrismaEstimation } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsDate, IsNotEmpty, IsNumber, IsString, IsUUID } from 'class-validator';

interface PrismaEstimationBase extends Omit<PrismaEstimation, keyof ModelBase> {}
interface EstimationBase extends PrismaEstimationBase {}

export interface Estimation extends EstimationBase, ModelBase {}

export interface EstimationInputDTO extends Omit<Estimation, keyof ModelBase> {}

export class BaseEstimationDTO {
  @IsUUID('all', { message: 'ID는 UUID 형식이어야 합니다.' })
  @ApiProperty({ description: 'MoveInfo의 ID', type: String })
  moveInfoId: string;

  @IsUUID('all', { message: '운전자의 ID는 UUID 형식이어야 합니다.' })
  @ApiProperty({ description: '운전자의 ID', type: String })
  driverId: string;
}

export class EstimationInputDTO {
  @IsString()
  @ApiProperty({ description: '견적 코멘트', type: String })
  comment: string;

  @IsNumber()
  @IsNotEmpty()
  @ApiProperty({ description: '견적 가격', type: Number })
  price: number;

  @IsBoolean()
  @ApiProperty({ description: '견적 반려 여부', type: Boolean })
  isRejected: boolean;

  // @IsString()
  // @ApiProperty({ description: '견적 상태', type: String })
  // status: 'Approve' | 'Reject';
}

export class EstimationEntity {
  @ApiProperty({ description: '견적 ID', type: String })
  id: string;

  @ApiProperty({ description: '작성 날짜', type: String, format: 'date-time' })
  createdAt: Date;

  @ApiProperty({ description: '수정 날짜', type: String, format: 'date-time' })
  updatedAt: Date;

  @ApiProperty({ description: '견적 가격', type: Number, nullable: true })
  price?: number;

  @ApiProperty({ description: '견적 코멘트', type: String })
  comment: string;

  @ApiProperty({ description: '이사 정보 ID', type: String })
  moveInfoId: string;

  @ApiProperty({ description: '드라이버 ID', type: String })
  driverId: string;
}

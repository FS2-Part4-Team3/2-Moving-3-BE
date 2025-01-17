import { ModelBase } from '#types/common.types.js';
import { Estimation as PrismaEstimation } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';

interface PrismaEstimationBase extends Omit<PrismaEstimation, keyof ModelBase> {}
interface EstimationBase extends PrismaEstimationBase {}

export interface Estimation extends EstimationBase, ModelBase {}

export interface EstimationInputDTO extends Omit<Estimation, keyof ModelBase> {}

export interface EstimationPostDTO {
  field1: string;
  field2: number;
}

export class EstimationEntity {
  @ApiProperty({ description: '견적 ID', type: String })
  id: string;

  @ApiProperty({ description: '생성 날짜', type: String, format: 'date-time' })
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

  //이거물어보기
  @ApiProperty({ description: '확정된 이사 정보 ID', type: String, nullable: true })
  confirmedForId?: string;
}

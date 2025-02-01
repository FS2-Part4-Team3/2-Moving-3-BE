import { ModelBase } from '#types/common.types.js';
import { Estimation as PrismaEstimation, ServiceType, Driver, MoveInfo, Progress, Request } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString, IsUUID } from 'class-validator';

interface PrismaEstimationBase extends Omit<PrismaEstimation, keyof ModelBase> {}
interface EstimationBase extends PrismaEstimationBase {}

export interface Estimation extends EstimationBase, ModelBase {
  driver?: Driver;
  moveInfos?: MoveInfo;
  request?: Request;
  designatedRequest?: IsActivate;
}

export interface EstimationInputDTO extends Omit<Estimation, keyof ModelBase> {}

export enum Status {
  PENDING = 'PENDING',
  EXPIRED = 'EXPIRED',
  APPLY = 'APPLY',
  REJECTED = 'REJECTED',
  CANCELED = 'CANCELED',
}

export enum progress {
  PENDING = 'PENDING',
  OPEN = 'OPEN',
  EXPIRED = 'EXPIRED',
  CONFIRMED = 'CONFIRMED',
  CANCELED = 'CONCELED',
  COMPLETE = 'COMPLETE',
}

export enum IsActivate {
  Active = 'Active',
  Inactive = 'Inactive',
}

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

  @IsOptional()
  @IsNumber({}, { each: true })
  @ApiProperty({ description: '견적 가격', type: Number, nullable: true })
  price: number | null = null;
}

export class EstimationOutputDTO {
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

class DriverInfoDTO {
  @ApiProperty({ description: '드라이버 프로필 사진', type: Image })
  driverImage: string;

  @ApiProperty({ description: '드라이버 이름', type: String })
  driverName: string;

  @ApiProperty({ description: '드라이버 별점', type: Number })
  driverRating: number;

  @ApiProperty({ description: '드라이버 경력(연차)', type: Number })
  driverExperience: number;

  @ApiProperty({ description: '확정 건수', type: Number })
  applyCount: number;

  @ApiProperty({ description: '찜 숫자', type: Number })
  likeCount: number;
}

class MoveInfoDTO {
  @ApiProperty({ description: '이사 날짜', type: String, format: 'date-time' })
  date: Date;

  @ApiProperty({ description: '서비스 타입', type: String })
  serviceType: ServiceType;

  @ApiProperty({ description: '출발지', type: String })
  fromAddress: string;

  @ApiProperty({ description: '도착지', type: String })
  toAddress: string;

  @ApiProperty({ description: '이사정보 상태', type: String })
  progress: Progress;
}

class EstimationInfoDTO {
  @ApiProperty({ description: '견적 가격', type: Number, nullable: true })
  price?: number;
}

export class UserEstimationListDTO {
  @ApiProperty({ description: '드라이버 정보', type: DriverInfoDTO })
  driverInfo: DriverInfoDTO;

  @ApiProperty({ description: '이사 정보', type: MoveInfoDTO })
  moveInfo: MoveInfoDTO;

  @ApiProperty({ description: '견적 정보', type: EstimationInfoDTO })
  estimationInfo: EstimationInfoDTO;

  @IsOptional()
  @ApiProperty({ description: '지정 견적 요청 상태', enum: ['Active', 'Inactive'] })
  designatedRequest: IsActivate; //'Active': 지정 요청 견적, 'Inactive': 일반 견적
}

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

class DriverDTO {
  @ApiProperty({ description: '드라이버 프로필 이미지', type: String, nullable: true })
  @IsOptional()
  image?: string;

  @ApiProperty({ description: '드라이버 이름', type: String })
  name: string;

  @ApiProperty({ description: '드라이버 별점', type: Number })
  rating: number;

  @ApiProperty({ description: '드라이버 리뷰 개수', type: Number })
  reviewCount: number;

  @ApiProperty({ description: '드라이버 경력(연차)', type: Number })
  career: number;

  @ApiProperty({ description: '확정 건수', type: Number })
  applyCount: number;

  @ApiProperty({ description: '드라이버 찜 여부', type: Boolean })
  likedUsers: boolean;

  @ApiProperty({ description: '찜 숫자', type: Number })
  likeCount: number;
}

class MoveInfoDTO {
  @ApiProperty({ description: '이사 정보 ID', type: String })
  moveInfoId: string;

  @ApiProperty({ description: '이사 날짜', type: String, format: 'date-time' })
  date: Date;

  @ApiProperty({ description: '서비스 타입', type: String })
  serviceType: ServiceType;

  @ApiProperty({ description: '출발지', type: String })
  fromAddress: string;

  @ApiProperty({ description: '도착지', type: String })
  toAddress: string;
}

class EstimationInfoDTO {
  @ApiProperty({ description: '견적 ID', type: String })
  estimationId: string;

  @ApiProperty({ description: '견적 가격', type: Number, nullable: true })
  price?: number;
}

export class UserEstimationListDTO {
  @ApiProperty({ description: '드라이버 정보', type: DriverDTO })
  driver: DriverDTO;

  @ApiProperty({ description: '이사 정보', type: MoveInfoDTO })
  moveInfo: MoveInfoDTO;

  @ApiProperty({ description: '견적 정보', type: EstimationInfoDTO })
  estimationInfo: EstimationInfoDTO;

  @IsOptional()
  @ApiProperty({ description: '지정 견적 요청 상태', enum: ['Active', 'Inactive'] })
  designatedRequest: IsActivate; //'Active': 지정 요청 견적, 'Inactive': 일반 견적
}

export class UserEstimationListWithCountDTO {
  @ApiProperty({ description: '견적 목록', type: [UserEstimationListDTO] })
  estimations: UserEstimationListDTO[];

  @ApiProperty({ description: '총 견적 개수', type: Number })
  totalCount: number;
}

class DriveList {
  @ApiProperty({ description: '드라이버 프로필 이미지', type: String, nullable: true })
  @IsOptional()
  image?: string;

  @ApiProperty({ description: '드라이버 이름', type: String })
  name: string;
}

class moveInfoList {
  @ApiProperty({ description: '이사 날짜', type: String, format: 'date-time' })
  date: Date;

  @ApiProperty({ description: '서비스 타입', type: String })
  serviceType: ServiceType;
}

class EstimationInfoList {
  @ApiProperty({ description: '견적 ID', type: String })
  estimationId: string;

  @ApiProperty({ description: '견적 가격', type: Number, nullable: true })
  price?: number;

  @ApiProperty({ description: '작성 날짜', type: String, format: 'date-time' })
  createdAt: Date;

  @ApiProperty({ description: '수정 날짜', type: String, format: 'date-time' })
  updatedAt: Date;
}

// 리뷰 작성 가능한 목록 조회 DTO
export class ReviewableListDTO {
  @ApiProperty({ description: '드라이버 정보', type: DriveList })
  driver: DriveList;

  @ApiProperty({ description: '이사 정보', type: moveInfoList })
  moveInfo: moveInfoList;

  @ApiProperty({ description: '견적 정보', type: EstimationInfoList })
  estimationInfo: EstimationInfoList;

  @IsOptional()
  @ApiProperty({ description: '지정 견적 요청 상태', enum: ['Active', 'Inactive'] })
  designatedRequest: IsActivate;
}

//리뷰 목록 조회
export class ReviewableListResponseDTO {
  @ApiProperty({ description: '작성 가능한 리뷰 목록', type: [ReviewableListDTO] })
  estimations: ReviewableListDTO[];

  @ApiProperty({ description: '총 견적 개수', type: Number })
  totalCount: number;
}

//유저 정보
class UserList {
  @ApiProperty({ description: '고객 이름', type: String })
  name: string;
}

//드라이버 보낸 견적 조회
export class DriverEstimationsListDTO {
  @ApiProperty({ description: '견적 정보', type: EstimationInfoList })
  estimationInfo: EstimationInfoList;

  @ApiProperty({ description: '이사 정보', type: MoveInfoDTO })
  moveInfo: MoveInfoDTO;

  @ApiProperty({ description: '고객 정보', type: UserList })
  user: UserList;

  @IsOptional()
  @ApiProperty({ description: '지정 견적 요청 상태', enum: ['Active', 'Inactive'] })
  designatedRequest: IsActivate;

  @ApiProperty({ description: '이사정보 상태', type: String })
  progress: Progress;
}

export class DriverEstimationsList {
  @ApiProperty({ description: '견적 정보', type: [DriverEstimationsListDTO] })
  estimations: DriverEstimationsListDTO[];

  @ApiProperty({ description: '총 견적 개수', type: Number })
  totalCount: number;
}

class MoveInfoDetail {
  @ApiProperty({ description: '이사 정보 ID', type: String })
  moveInfoId: string;

  @ApiProperty({ description: '작성 날짜', type: String, format: 'date-time' })
  createdAt: Date;

  @ApiProperty({ description: '이사 날짜', type: String, format: 'date-time' })
  date: Date;

  @ApiProperty({ description: '서비스 타입', type: String })
  serviceType: ServiceType;

  @ApiProperty({ description: '출발지', type: String })
  fromAddress: string;

  @ApiProperty({ description: '도착지', type: String })
  toAddress: string;

  @ApiProperty({ description: '이사정보 상태', type: String })
  progress: string;
}

class EstimationDetail {
  @IsString()
  @ApiProperty({ description: '견적 코멘트', type: String })
  comment: string;

  @ApiProperty({ description: '견적 ID', type: String })
  id: string;

  @ApiProperty({ description: '견적 가격', type: Number, nullable: true })
  price?: number;
}

// 유저 상세조회
export class UserEstimationDetailDTO {
  @ApiProperty({ description: '드라이버 아이디', type: String })
  driverId: string;

  @ApiProperty({ description: '이사 정보', type: MoveInfoDetail })
  moveInfo: MoveInfoDetail;

  @ApiProperty({ description: '견적 정보', type: EstimationDetail })
  estimationInfo: EstimationDetail;

  @IsOptional()
  @ApiProperty({ description: '지정 견적 요청 상태', enum: ['Active', 'Inactive'] })
  designatedRequest: IsActivate;
}

class DriverMoveInfoDetail {
  @ApiProperty({ description: '작성 날짜', type: String, format: 'date-time' })
  createdAt: Date;

  @ApiProperty({ description: '이사 날짜', type: String, format: 'date-time' })
  date: Date;

  @ApiProperty({ description: '서비스 타입', type: String })
  serviceType: ServiceType;

  @ApiProperty({ description: '출발지', type: String })
  fromAddress: string;

  @ApiProperty({ description: '도착지', type: String })
  toAddress: string;
}
//견적 상세 조회
export class DriverEstimationDetailDTO {
  @ApiProperty({ description: '고객 정보', type: UserList })
  user: UserList;

  @ApiProperty({ description: '견적 정보', type: EstimationInfoList })
  estimationInfo: EstimationInfoList;

  @ApiProperty({ description: '이사 정보', type: DriverMoveInfoDetail })
  moveInfo: DriverMoveInfoDetail;

  @IsOptional()
  @ApiProperty({ description: '지정 견적 요청 상태', enum: ['Active', 'Inactive'] })
  designatedRequest: IsActivate;
}

class RejectMoveInfo {
  @ApiProperty({ description: '이사 날짜', type: String, format: 'date-time' })
  date: Date;

  @ApiProperty({ description: '서비스 타입', type: String })
  serviceType: ServiceType;

  @ApiProperty({ description: '출발지', type: String })
  fromAddress: string;

  @ApiProperty({ description: '도착지', type: String })
  toAddress: string;
}

class RejectEstimation {
  @ApiProperty({ description: '견적 ID', type: String })
  estimationId: string;
}
export class RejectedEstimationsListDTO {
  @ApiProperty({ description: '이사 정보', type: RejectMoveInfo })
  moveInfo: RejectMoveInfo;

  @ApiProperty({ description: '고객 정보', type: UserList })
  user: UserList;

  @ApiProperty({ description: '견적 정보', type: RejectEstimation })
  estimationInfo: RejectEstimation;
}

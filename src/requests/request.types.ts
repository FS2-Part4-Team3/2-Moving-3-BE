import { ModelBase, Status } from '#types/common.types.js';
import { ApiProperty } from '@nestjs/swagger';
import { Request as PrismaRequest } from '@prisma/client';
import { IsNotEmpty, IsOptional, IsUUID } from 'class-validator';

interface PrismaRequestBase extends Omit<PrismaRequest, keyof ModelBase> {}
interface RequestBase extends PrismaRequestBase {}

export interface Request extends RequestBase, ModelBase {}

export interface RequestInputDTO extends Omit<Omit<Request, keyof ModelBase>, 'notificationId'> {}

export interface IRequest {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;

  moveInfoId: string;
  status: Status;

  driverId: string;
}

export class BaseRequestOutputDTO {
  @ApiProperty({ description: '지정견적요청 ID', type: String })
  id: string;

  @ApiProperty({ description: '작성 날짜', type: Date, format: 'date-time' })
  createdAt: Date;

  @ApiProperty({ description: '수정 날짜', type: Date, format: 'date-time' })
  updatedAt: Date;

  @ApiProperty({ description: '삭제 날짜', type: Date, format: 'date-time' })
  deletedAt: Date;

  @ApiProperty({ description: '이사정보 ID', type: String })
  moveInfoId: string;

  @ApiProperty({ description: '요청 상태', type: String })
  status: Status;

  @ApiProperty({ description: '기사 ID', type: String })
  driverId: string;
}

export class MoveInfoOwnerIdDTO {
  @ApiProperty({ description: '이사정보 작성자 ID', type: String })
  ownerId: string;
}

export class RequestOutputDTO extends BaseRequestOutputDTO {
  @ApiProperty({ description: '이사 정보 목록', type: MoveInfoOwnerIdDTO })
  moveInfo: MoveInfoOwnerIdDTO;
}

export class checkRequestOutputDTO {
  @ApiProperty({ description: '지정견적요청 가능여부', type: Boolean })
  isRequestPossible: boolean;
}

export class CreateRequestDTO {
  @IsUUID()
  @IsNotEmpty()
  @ApiProperty({ description: '이사정보 ID', type: String })
  moveInfoId: string;

  @IsNotEmpty()
  @ApiProperty({ description: '요청 상태', type: String })
  status: Status;

  @IsUUID()
  @IsNotEmpty()
  @ApiProperty({ description: '기사 ID', type: String })
  driverId: string;
}

export class PatchRequestDTO {
  @IsOptional()
  @ApiProperty({ description: '요청 상태', type: String })
  status: Status;
}

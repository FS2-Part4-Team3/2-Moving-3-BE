import { ModelBase } from '#types/common.types.js';
import { ApiProperty } from '@nestjs/swagger';
import { Request as PrismaRequest, Status } from '@prisma/client';

interface PrismaRequestBase extends Omit<PrismaRequest, keyof ModelBase> {}
interface RequestBase extends PrismaRequestBase {}

export interface Request extends RequestBase, ModelBase {}

export interface RequestInputDTO extends Omit<Omit<Request, keyof ModelBase>, 'notificationId'> {}

export class BaseRequestOutputDTO {
  @ApiProperty({ description: '지정견적요청 ID', type: String })
  id: string;

  @ApiProperty({ description: '작성 날짜', type: String, format: 'date-time' })
  createdAt: string;

  @ApiProperty({ description: '수정 날짜', type: String, format: 'date-time' })
  updatedAt: string;

  @ApiProperty({ description: '이사정보 ID', type: String })
  moveInfoId: string;

  @ApiProperty({ description: '요청 상태', type: String })
  status: Status;

  @ApiProperty({ description: '기사 ID', type: String })
  driverId: string;
}

export class MoveInfoDTO {
  @ApiProperty({ description: '이사정보 작성자 ID', type: String })
  ownerId: string;
}

export class RequestOutputDTO extends BaseRequestOutputDTO {
  @ApiProperty({ description: '이사 정보 목록', type: MoveInfoDTO })
  moveInfo: MoveInfoDTO;
}

export class checkRequestOutputDTO {
  @ApiProperty({ description: '지정견적요청 가능여부', type: Boolean })
  isRequestPossible: boolean;
}

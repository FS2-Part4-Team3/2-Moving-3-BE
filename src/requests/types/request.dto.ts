import { Status } from '#types/common.types.js';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsUUID } from 'class-validator';

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

export class RequestOutputDTO extends BaseRequestOutputDTO {
  @ApiProperty({ description: '이사 정보의 작성자', type: String })
  moveInfoOwnerId: String;
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

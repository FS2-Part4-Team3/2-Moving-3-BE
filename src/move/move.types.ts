import { ModelBase } from '#types/common.types.js';
import { ApiProperty } from '@nestjs/swagger';
import { MoveInfo as PrismaMoveInfo, Progress, ServiceType } from '@prisma/client';

interface PrismaMoveInfoBase extends Omit<PrismaMoveInfo, keyof ModelBase> {}
interface MoveInfoBase extends PrismaMoveInfoBase {}

export interface MoveInfo extends MoveInfoBase, ModelBase {}

export interface MoveInfoInputDTO extends Omit<MoveInfo, keyof ModelBase> {}

export class BaseMoveInfoOutputDTO {
  @ApiProperty({ description: '이사정보 ID', type: String })
  id: string;

  @ApiProperty({ description: '작성 날짜', type: String, format: 'date-time' })
  createdAt: string;

  @ApiProperty({ description: '수정 날짜', type: String, format: 'date-time' })
  updatedAt: string;

  @ApiProperty({ description: '이사 유형', type: String })
  serviceType: ServiceType;

  @ApiProperty({ description: '이사 날짜', type: String, format: 'date-time' })
  date: string;

  @ApiProperty({ description: '출발지', type: String })
  fromAddress: string;

  @ApiProperty({ description: '도착지', type: String })
  toAddress: string;

  @ApiProperty({ description: '이사정보 상태', type: String })
  progress: Progress;

  @ApiProperty({ description: '확정 견적 ID', type: String })
  confirmedEstimationId: string;

  @ApiProperty({ description: '작성자 ID', type: String })
  ownerId: string;
}

class OwnerNameDTO {
  @ApiProperty({ description: '작성자 이름', type: String })
  name: String;
}

class MoveInfoOutputDTO extends BaseMoveInfoOutputDTO {
  @ApiProperty({ description: '이사 정보 목록', type: OwnerNameDTO })
  owner: OwnerNameDTO;
}

export class MoveInfoResponseDTO {
  @ApiProperty({ description: '전체 이사정보 개수', type: Number })
  totalCount: number;

  @ApiProperty({ description: '리뷰 목록', type: [MoveInfoOutputDTO] })
  list: MoveInfoOutputDTO[];
}

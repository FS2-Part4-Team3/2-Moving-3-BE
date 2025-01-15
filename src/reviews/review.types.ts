import { ModelBase } from '#types/common.types.js';
import { ApiProperty } from '@nestjs/swagger';
import { Review as PrismaReview } from '@prisma/client';

interface PrismaReviewBase extends Omit<PrismaReview, keyof ModelBase> {}
interface ReviewBase extends PrismaReviewBase {}

export interface Review extends ReviewBase, ModelBase {}

export interface ReviewInputDTO extends Omit<Review, keyof ModelBase> {}

export class ReviewOutputDTO {
  @ApiProperty({ description: '리뷰 ID', type: String })
  id: string;

  @ApiProperty({ description: '작성 날짜', type: String, format: 'date-time' })
  createdAt: string;

  @ApiProperty({ description: '수정 날짜', type: String, format: 'date-time' })
  updatedAt: string;

  @ApiProperty({ description: '리뷰 내용', type: String })
  comment: string;

  @ApiProperty({ description: '점수', type: Number })
  score: number;

  @ApiProperty({ description: '기사 ID', type: String })
  driverId: string;

  @ApiProperty({ description: '작성자 ID', type: String })
  ownerId: string;
}

class ConfirmedEstimationDTO {
  @ApiProperty({ description: '견적 가격', type: Number })
  price: number;
}

class MoveInfoDTO {
  @ApiProperty({ description: '이사 유형', type: String })
  type: string;

  @ApiProperty({ description: '이사 날짜', type: String, format: 'date-time' })
  date: string;

  @ApiProperty({ description: '확정된 견적', type: ConfirmedEstimationDTO })
  confirmedEstimation: ConfirmedEstimationDTO;
}

class OwnerMoveInfosDTO {
  @ApiProperty({ description: '이사 정보 목록', type: [MoveInfoDTO] })
  moveInfos: MoveInfoDTO[];
}

class OwnerNameDTO {
  @ApiProperty({ description: '작성자 이름', type: String })
  name: String;
}

class DriverDTO {
  @ApiProperty({ description: '기사 이름', type: String })
  name: String;
  @ApiProperty({ description: '기사 이미지', type: String })
  image: String;
}

class MyReviewOutputDTO extends ReviewOutputDTO {
  @ApiProperty({
    description: '기사 정보',
    type: DriverDTO,
  })
  driver: DriverDTO;
  @ApiProperty({
    description: '작성자 정보',
    type: OwnerMoveInfosDTO,
  })
  owner: OwnerMoveInfosDTO;
}

class DriverReviewOutputDTO extends ReviewOutputDTO {
  @ApiProperty({
    description: '작성자 정보',
    type: OwnerNameDTO,
  })
  owner: OwnerNameDTO;
}

export class MyReviewResponseDTO {
  @ApiProperty({ description: '전체 리뷰 개수', type: Number })
  totalCount: number;

  @ApiProperty({ description: '리뷰 목록', type: [MyReviewOutputDTO] })
  list: MyReviewOutputDTO[];
}

export class DriverReviewResponseDTO {
  @ApiProperty({ description: '전체 리뷰 개수', type: Number })
  totalCount: number;

  @ApiProperty({ description: '리뷰 목록', type: [DriverReviewOutputDTO] })
  list: DriverReviewOutputDTO[];
}

export class ReviewInputDTO {
  @ApiProperty({ description: '리뷰 내용', type: String })
  comment: string;
  @ApiProperty({ description: '점수', type: Number })
  score: number;
}

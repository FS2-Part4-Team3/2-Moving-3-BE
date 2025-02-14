import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsPositive, IsString, IsUUID } from 'class-validator';

export class ReviewOutputDTO {
  @ApiProperty({ description: '리뷰 ID', type: String })
  id: string;

  @ApiProperty({ description: '작성 날짜', type: Date, format: 'date-time' })
  createdAt: Date;

  @ApiProperty({ description: '수정 날짜', type: Date, format: 'date-time' })
  updatedAt: Date;

  @ApiProperty({ description: '삭제 날짜', type: Date, format: 'date-time' })
  deletedAt: Date;

  @ApiProperty({ description: '리뷰 내용', type: String })
  comment: string;

  @ApiProperty({ description: '점수', type: Number })
  score: number;

  @ApiProperty({ description: '기사 ID', type: String })
  driverId: string;

  @ApiProperty({ description: '작성자 ID', type: String })
  ownerId: string;

  @ApiProperty({ description: '견적 ID', type: String })
  estimationId: string;
}

class ReviewRequestDTO {
  @ApiProperty({ description: '이사 정보 상태', type: String })
  status: String;

  @ApiProperty({ description: '기사 ID', type: String })
  driverId: String;
}

class ReviewMoveInfoDTO {
  @ApiProperty({ description: '이사 유형', type: String })
  type: string;

  @ApiProperty({ description: '이사 날짜', type: String, format: 'date-time' })
  date: string;

  @ApiProperty({ description: '확정된 견적', type: [ReviewRequestDTO] })
  requests: ReviewRequestDTO[];
}

class ReviewEstimationDTO {
  @ApiProperty({ description: '견적가', type: Number })
  price: Number;

  @ApiProperty({ description: '이사정보', type: ReviewMoveInfoDTO })
  moveInfo: ReviewMoveInfoDTO;

  @ApiProperty({ description: '지정견적요청 여부', type: Boolean })
  isSpecificRequest: Boolean;
}

class ReviewDriverDTO {
  @ApiProperty({ description: '기사 이름', type: String })
  name: String;

  @ApiProperty({ description: '기사 이미지', type: String })
  image: String;
}

export class MyReviewOutputDTO extends ReviewOutputDTO {
  @ApiProperty({
    description: '견적 정보',
    type: ReviewEstimationDTO,
  })
  estimation: ReviewEstimationDTO;

  @ApiProperty({
    description: '기사 정보',
    type: ReviewDriverDTO,
  })
  driver: ReviewDriverDTO;
}

class OwnerNameDTO {
  @ApiProperty({ description: '작성자 이름', type: String })
  name: String;
}

export class DriverReviewOutputDTO extends ReviewOutputDTO {
  @ApiProperty({
    description: '작성자 정보',
    type: OwnerNameDTO,
  })
  owner: OwnerNameDTO;
}

export class ratingStatsDTO {
  @ApiProperty({ description: '점수 개수', type: Number })
  _count: number;

  @ApiProperty({ description: '점수', type: Number })
  score: number;
}

export class statsDTO {
  @ApiProperty({ description: '평균 점수', type: Number })
  averageRating: number;

  @ApiProperty({ description: '각 점수 갯수([1, 2, 3, ,4 ,5]순)', type: [Number] })
  ratingCounts: number[];
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

  @ApiProperty({ description: '통계', type: statsDTO })
  stats: statsDTO;

  @ApiProperty({ description: '리뷰 목록', type: [DriverReviewOutputDTO] })
  list: DriverReviewOutputDTO[];
}

export class ReviewBodyDTO {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({ description: '리뷰 내용', type: String })
  comment: string;

  @IsNotEmpty()
  @IsPositive()
  @ApiProperty({ description: '점수', type: Number })
  score: number;
}

export class CreateReviewDTO extends ReviewBodyDTO {
  @IsUUID()
  @IsNotEmpty()
  ownerId: string;

  @IsUUID()
  @IsNotEmpty()
  driverId: string;

  @IsUUID()
  @IsNotEmpty()
  estimationId: string;
}

export class PatchReviewDTO {
  @IsOptional()
  @IsString()
  @ApiProperty({ description: '리뷰 내용', type: String })
  comment: string;

  @IsOptional()
  @IsPositive()
  @ApiProperty({ description: '점수', type: Number })
  score: number;
}

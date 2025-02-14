import { ApiProperty } from '@nestjs/swagger';

export class AiReviewSummaryResponseDTO {
  @ApiProperty({ description: '이사정보 ID', type: String })
  id: string;

  @ApiProperty({ description: '작성 날짜', type: String, format: 'date-time' })
  createdAt: Date;

  @ApiProperty({ description: '수정 날짜', type: String, format: 'date-time' })
  updatedAt: Date;

  @ApiProperty({ description: '삭제된 날짜', type: String, format: 'date-time' })
  deletedAt: Date;

  @ApiProperty({ description: '요약된 리뷰', type: String })
  summaryReview: string;

  @ApiProperty({ description: '드라이버 ID', type: String })
  driverId: string;
}

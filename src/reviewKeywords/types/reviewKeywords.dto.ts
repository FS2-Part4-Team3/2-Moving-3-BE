import { KeywordType, KeywordTypeEnum } from '#types/common.types.js';
import { ApiProperty } from '@nestjs/swagger';

export class ReviewKeywordsDTO {
  @ApiProperty({ description: '리뷰 키워드 ID', type: String })
  id: string;

  @ApiProperty({ description: '작성 날짜', type: Date, format: 'date-time' })
  createdAt: Date;

  @ApiProperty({ description: '수정 날짜', type: Date, format: 'date-time' })
  updatedAt: Date;

  @ApiProperty({ description: '삭제 날짜', type: Date, format: 'date-time' })
  deletedAt: Date;

  @ApiProperty({ description: '키워드', type: String })
  keyword: string;

  @ApiProperty({ description: '키워드', type: String })
  type: KeywordType;

  @ApiProperty({ description: '키워드 개수', type: Number })
  count: number;

  @ApiProperty({ description: '기사 ID', type: String })
  driverId: string;
}

export class DeleteKeywordsDTO {
  @ApiProperty({ description: '삭제된 레코드의 개수', type: Number })
  count: number;
}

class AnalyzedKeywordsWithCountDTO {
  @ApiProperty({ description: '키워드', type: String })
  keyword: string;

  @ApiProperty({ description: '키워드 개수', type: Number })
  count: number;
}

class AddedKeywordsDTO {
  @ApiProperty({ description: '긍정적 키워드', type: [AnalyzedKeywordsWithCountDTO] })
  positive: AnalyzedKeywordsWithCountDTO[];

  @ApiProperty({ description: '부정적 키워드', type: [AnalyzedKeywordsWithCountDTO] })
  negative: AnalyzedKeywordsWithCountDTO[];
}

export class AnalyzeAiReviewKeywordsDTO {
  @ApiProperty({ description: '추가된 키워드', type: AddedKeywordsDTO })
  addedKeywords: AddedKeywordsDTO;

  @ApiProperty({ description: '삭제된 키워드', type: [String] })
  removedKeywords: string[];
}

export class KeywordDTO {
  @ApiProperty({ description: '키워드' })
  keyword: string;

  @ApiProperty({ description: '키워드의 출현 횟수' })
  count: number;
}

export class ReviewKeywordsResponseDTO {
  @ApiProperty({ description: 'POSITIVE 타입의 키워드들', type: [KeywordDTO] })
  positive: KeywordDTO[];

  @ApiProperty({ description: 'NEGATIVE 타입의 키워드들', type: [KeywordDTO] })
  negative: KeywordDTO[];
}

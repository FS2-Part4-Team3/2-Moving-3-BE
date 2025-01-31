import { PersonalInfo } from '#auth/types/filtered.types.js';
import { ProviderInfo } from '#auth/types/provider.types.js';
import { UserType } from '#types/common.types.js';
import { ApiProperty } from '@nestjs/swagger';
import { Area, ServiceType } from '@prisma/client';

export class FilteredDriverOutputDTO extends PersonalInfo implements ProviderInfo {
  @ApiProperty({ description: '닉네임' })
  nickname: string;

  @ApiProperty({ description: '자기소개' })
  introduce: string;

  @ApiProperty({ description: '상세 설명' })
  description: string;

  @ApiProperty({ description: '서비스 타입' })
  serviceType: ServiceType[];

  @ApiProperty({ description: '서비스 가능 지역' })
  availableAreas: Area[];

  @ApiProperty({ description: '확정 회수' })
  applyCount: number;

  @ApiProperty({ description: '찜하기 회수' })
  likeCount: number;

  @ApiProperty({ description: '경력 시작일' })
  startAt: Date;

  @ApiProperty({ description: '경력 년수' })
  career: number;

  @ApiProperty({ description: '유저 타입' })
  type: UserType.Driver;

  @ApiProperty({ description: '기사 점수' })
  rating: number;

  @ApiProperty({ description: '리뷰 개수' })
  reviewCount: number;

  @ApiProperty({ description: '소셜 로그인 프로바이더' })
  provider: string;

  @ApiProperty({ description: '프로바이더 아이디' })
  providerId: string;

  @ApiProperty({ description: '이미지 업로드 URL' })
  uploadUrl?: string;
}

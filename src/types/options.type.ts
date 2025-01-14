import { ApiProperty } from '@nestjs/swagger';
import { Area, ServiceType } from '@prisma/client';
import { IsEnum, IsInt, IsOptional, IsString, Min } from 'class-validator';

export class OffsetPaginationOptions {
  @IsOptional()
  @IsInt({ message: '페이지는 정수형입니다.' })
  @Min(1)
  @ApiProperty({ description: '페이지' })
  page: number;

  @IsOptional()
  @IsInt({ message: '페이지 크기는 정수형입니다.' })
  @Min(1)
  @ApiProperty({ description: '페이지 크기' })
  pageSize: number;
}

export enum SortOrder {
  MostReviewed = 'MostReviewed',
  HighestRating = 'HighestRating',
  MostApplied = 'MostApplied',
  Latest = 'Latest',
  Oldest = 'Oldest',
  Recent = 'Recent',
  UpcomingMoveDate = 'UpcomingMoveDate',
  RecentRequest = 'RecentRequest',
}

export class FindOptions extends OffsetPaginationOptions {
  @IsOptional()
  @IsEnum(SortOrder, { message: '올바른 정렬 기준을 골라주세요' })
  @ApiProperty({ description: '정렬 기준' })
  orderBy: SortOrder;

  @IsOptional()
  @IsString({ message: '검색어는 문자열 형식입니다.' })
  @ApiProperty({ description: '검색어' })
  keyword: string;
}

export class DriversFindOptions extends FindOptions {
  @IsOptional()
  @IsEnum(Area, { message: '올바른 지역을 골라주세요.' })
  @ApiProperty({ description: '이용 지역' })
  area: Area;

  @IsOptional()
  @IsEnum(ServiceType, { message: '올바른 서비스 타입을 골라주세요.' })
  @ApiProperty({ description: '서비스 타입' })
  serviceType: ServiceType;
}

export interface RequestFilter {
  moveType?: string;
  serviceArea?: boolean;
  designated?: boolean;
}

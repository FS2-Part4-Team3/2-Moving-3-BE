import { ApiProperty, OmitType } from '@nestjs/swagger';
import { Area, ServiceType } from '@prisma/client';
import { Type } from 'class-transformer';
import { IsEnum, IsInt, IsOptional, IsString, Min } from 'class-validator';

export class OffsetPaginationOptions {
  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: '페이지는 정수형입니다.' })
  @Min(1)
  @ApiProperty({ description: '페이지' })
  page: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: '페이지 크기는 정수형입니다.' })
  @Min(1)
  @ApiProperty({ description: '페이지 크기' })
  pageSize: number;
}

export enum SortOrder {
  Latest = 'Latest',
  Oldest = 'Oldest',
  Recent = 'Recent',
}

export enum MoveInfoSortOrder {
  UpcomingMoveDate = 'UpcomingMoveDate',
  RecentRequest = 'RecentRequest',
}

export enum DriverSortOrder {
  MostReviewed = 'MostReviewed',
  HighestRating = 'HighestRating',
  MostApplied = 'MostApplied',
  HighestCareer = 'HighestCareer',
}

export enum IsActivate {
  Active = 'Active',
  Inactive = 'Inactive',
}

export enum EstimationsFilter {
  all = 'all',
  confirmed = 'confirmed',
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

export class DriversFindOptions extends OmitType(FindOptions, ['orderBy']) {
  @IsOptional()
  @IsEnum(DriverSortOrder, { message: '올바른 정렬 기준을 골라주세요' })
  @ApiProperty({ description: '정렬 기준' })
  orderBy: DriverSortOrder;

  @IsOptional()
  @IsEnum(Area, { message: '올바른 지역을 골라주세요.' })
  @ApiProperty({ description: '이용 지역' })
  area: Area;

  @IsOptional()
  @IsEnum(ServiceType, { message: '올바른 서비스 타입을 골라주세요.' })
  @ApiProperty({ description: '서비스 타입' })
  serviceType: ServiceType;

  @IsOptional()
  likedUserId?: string;
}

export class MoveInfoFilter extends OmitType(FindOptions, ['orderBy']) {
  @IsOptional()
  @IsEnum(MoveInfoSortOrder, { message: '올바른 정렬 기준을 골라주세요' })
  @ApiProperty({ description: '정렬 기준' })
  orderBy: MoveInfoSortOrder;

  @IsOptional()
  @IsString({ message: 'Active, Inactive 보내주세요' })
  @ApiProperty({ description: '서비스 타입' })
  serviceType: string;

  @IsOptional()
  @IsString({ message: 'Active, Inactive 보내주세요' })
  @ApiProperty({ description: '서비스 가능 지역' })
  serviceArea: string;

  @IsOptional()
  @IsString({ message: 'Active, Inactive로 보내주세요' })
  @ApiProperty({ description: '지정 견적 요청' })
  designatedRequest: string;
}

export class moveInfoWithEstimationsFilter {
  @IsEnum(EstimationsFilter, { message: 'all, confirmed를 보내주세요' })
  @ApiProperty({ description: '받았던 견적 필터링' })
  filter: EstimationsFilter;
}

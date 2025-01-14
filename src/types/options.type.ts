import { ApiProperty } from '@nestjs/swagger';
import { Area, ServiceType } from '@prisma/client';

export class OffsetPaginationOptions {
  @ApiProperty({ description: '페이지' })
  page: number;

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
  @ApiProperty({ description: '정렬 기준' })
  orderBy: SortOrder;

  @ApiProperty({ description: '검색어' })
  keyword: string;
}

export class DriversFindOptions extends FindOptions {
  area: Area;
  serviceType: ServiceType;
}

export interface RequestFilter {
  moveType?: string;
  serviceArea?: boolean;
  designated?: boolean;
}

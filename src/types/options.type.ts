export interface OffsetPaginationOptions {
  page: number;
  pageSize: number;
}

export enum SortOrder {
  Latest = 'Latest',
  Oldest = 'Oldest',
  Recent = 'Recent',
  MoveDate = 'MoveDate',
}

export interface FindOptions extends OffsetPaginationOptions {
  orderBy: SortOrder;
  keyword: string;
}

export interface RequestFilter {
  moveType?: string;
  serviceArea?: string;
  designated?: boolean;
}

export interface OffsetPaginationOptions {
  page: number;
  pageSize: number;
}

export enum SortOrder {
  Latest = 'Latest',
  Oldest = 'Oldest',
  Recent = 'Recent',
}

export interface FindOptions extends OffsetPaginationOptions {
  orderBy: SortOrder;
  keyword: string;
}

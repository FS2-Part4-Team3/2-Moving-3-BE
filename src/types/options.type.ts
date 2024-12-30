export interface OffsetPaginationOptions {
  page: number;
  pageSize: number;
}

export enum SortOrder {
  Recent = 'Recent',
}

export interface FindOptions extends OffsetPaginationOptions {
  orderBy: string;
  keyword: string;
}

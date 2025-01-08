export interface OffsetPaginationOptions {
  page: number;
  pageSize: number;
}

export enum SortOrder {
  Recent = 'Recent',
  MoveDate = 'MoveDate',
}

export interface FindOptions extends OffsetPaginationOptions {
  orderBy: string;
  keyword: string;
}

export interface RequestFilter {
  moveType?: string;
  serviceArea?: string;
  designated?: boolean;
}

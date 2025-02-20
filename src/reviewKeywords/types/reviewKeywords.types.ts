import { KeywordType } from '#types/common.types.js';

export interface IReviewKeywords {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date;

  keyword: string;
  type: KeywordType;
  count: number;

  driverId: string;
}

export type reviewKeywordSortOrderType = { count: 'asc' | 'desc' };

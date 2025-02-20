import {
  DeleteKeywordsDTO,
  KeywordWithTypeDTO,
  PositiveOrNegativeKeywordsDTO,
  ReviewKeywordsDTO,
  TopKeywordsDTO,
} from '#reviewKeywords/types/reviewKeywords.dto.js';
import { reviewKeywordSortOrderType } from '#reviewKeywords/types/reviewKeywords.types.js';
import { KeywordType } from '#types/common.types.js';

export interface IReviewKeywordsRepository {
  findByDriverId: (driverId: string) => Promise<KeywordWithTypeDTO[]>;
  findTopKeywords: (driverId: string, orderBy: reviewKeywordSortOrderType) => Promise<TopKeywordsDTO>;
  findByType: (
    driverId: string,
    type: KeywordType,
    page: number,
    pageSize: number,
    orderBy: reviewKeywordSortOrderType,
  ) => Promise<PositiveOrNegativeKeywordsDTO>;
  upsertKeywords: (driverId: string, keyword: string, type: KeywordType, count: number) => Promise<ReviewKeywordsDTO>;
  deleteKeywords: (driverId: string, keywords: string[]) => Promise<DeleteKeywordsDTO>;
}

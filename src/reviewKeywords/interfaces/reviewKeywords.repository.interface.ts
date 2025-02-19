import { DeleteKeywordsDTO, KeywordDTO, ReviewKeywordsDTO } from '#reviewKeywords/types/reviewKeywords.dto.js';
import { KeywordType } from '#types/common.types.js';
import { ReviewKeywordsGetQueries } from '#types/queries.type.js';

export interface IReviewKeywordsRepository {
  findByDriverId: (driverId: string, options?: ReviewKeywordsGetQueries) => Promise<KeywordDTO[]>;
  upsertKeywords: (driverId: string, keyword: string, type: KeywordType, count: number) => Promise<ReviewKeywordsDTO>;
  deleteKeywords: (driverId: string, keywords: string[]) => Promise<DeleteKeywordsDTO>;
}

import { DeleteKeywordsDTO, ReviewKeywordsDTO } from '#reviewKeywords/types/reviewKeywords.dto.js';
import { KeywordType } from '#types/common.types.js';

export interface IReviewKeywordsRepository {
  findByDriverId: (driverId: string) => Promise<ReviewKeywordsDTO[]>;
  upsertKeywords: (driverId: string, keyword: string, type: KeywordType, count: number) => Promise<ReviewKeywordsDTO>;
  deleteKeywords: (driverId: string, keywords: string[]) => Promise<DeleteKeywordsDTO>;
}

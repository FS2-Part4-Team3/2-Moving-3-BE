import { AnalyzeAiReviewKeywordsDTO, ReviewKeywordsResponseDTO } from '#reviewKeywords/types/reviewKeywords.dto.js';
import { ReviewKeywordsGetQueries } from '#types/queries.type.js';

export interface IReviewKeywordsService {
  findByDriverId: (driverId: string, options: ReviewKeywordsGetQueries) => Promise<ReviewKeywordsResponseDTO>;
  analyzeAiReviewKeywords: (driverId: string) => Promise<AnalyzeAiReviewKeywordsDTO>;
}

import { AnalyzeAiReviewKeywordsDTO, ReviewKeywordsResponseDTO } from '#reviewKeywords/types/reviewKeywords.dto.js';
import { ReviewKeywordsGetQueries } from '#types/queries.type.js';

export interface IReviewKeywordsController {
  getReviewKeywords: (driverId: string, query: ReviewKeywordsGetQueries) => Promise<ReviewKeywordsResponseDTO>;
  analyzeAiReviewKeywords: (driverId: string) => Promise<AnalyzeAiReviewKeywordsDTO>;
}

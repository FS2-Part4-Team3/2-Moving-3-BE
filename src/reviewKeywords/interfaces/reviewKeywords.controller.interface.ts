import { AnalyzeAiReviewKeywordsDTO, ReviewKeywordsDTO } from '#reviewKeywords/types/reviewKeywords.dto.js';

export interface IReviewKeywordsController {
  getReviewKeywords: (driverId: string) => Promise<ReviewKeywordsDTO[]>;
  analyzeAiReviewKeywords: (driverId: string) => Promise<AnalyzeAiReviewKeywordsDTO>;
}

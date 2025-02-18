import { AnalyzeAiReviewKeywordsDTO, ReviewKeywordsDTO } from '#reviewKeywords/types/reviewKeywords.dto.js';

export interface IReviewKeywordsService {
  findByDriverId: (driverId: string) => Promise<ReviewKeywordsDTO[]>;
  analyzeAiReviewKeywords: (driverId: string) => Promise<AnalyzeAiReviewKeywordsDTO>;
}

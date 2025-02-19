import { Injectable } from '@nestjs/common';
import { GoogleGenerativeAI } from '@google/generative-ai';

@Injectable()
export class GoogleGeminiService {
  private genAI: GoogleGenerativeAI;

  constructor() {
    this.genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  }

  async summarizeReviews(reviews: string) {
    const model = this.genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    const result = await model.generateContent({
      contents: [{ role: 'user', parts: [{ text: `다음 리뷰들을 종합해서 간결하고 자연스럽게 요약해줘:\n\n${reviews}` }] }],
    });

    const response = await result.response.text();

    return response || '요약 실패';
  }

  async extractKeywordsWithCount(
    reviewsText: string,
  ): Promise<{ positive: { keyword: string; count: number }[]; negative: { keyword: string; count: number }[] }> {
    try {
      const model = this.genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

      const promptText = `다음 리뷰에서 긍정적/부정적 키워드를 JSON 형식으로 추출하고, 각 키워드가 등장한 횟수도 포함해 주세요.
      JSON 형식 예시:
      {
        "positive": [{"keyword": "친절", "count": 3}, {"keyword": "세심한 서비스", "count": 2}],
        "negative": [{"keyword": "짐 손상", "count": 1}, {"keyword": "불친절", "count": 4}]
      }
  
      리뷰 텍스트:
      "${reviewsText}"
  
      위의 JSON 형식 예시처럼 단어 위주로 추출해주세요.`;

      const result = await model.generateContent({
        contents: [{ role: 'user', parts: [{ text: promptText }] }],
      });

      const responseText = await result.response.text();

      // 백틱과 코드 블록 제거
      const cleanedResponse = responseText
        .replace(/```json/g, '')
        .replace(/```/g, '')
        .trim();

      // JSON 파싱
      const parsedResponse = JSON.parse(cleanedResponse);

      return {
        positive: parsedResponse.positive || [],
        negative: parsedResponse.negative || [],
      };
    } catch (error) {
      console.error('Error extracting keywords:', error);
      return { positive: [], negative: [] };
    }
  }
}

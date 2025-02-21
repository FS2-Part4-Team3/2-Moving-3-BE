import { Injectable } from '@nestjs/common';
import { GoogleGenerativeAI, SchemaType } from '@google/generative-ai';

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
      const keywordSchema = {
        description: 'AI가 추출한 키워드 목록',
        type: SchemaType.OBJECT,
        properties: {
          positive: {
            type: SchemaType.ARRAY,
            description: '긍정적인 키워드 리스트',
            items: {
              type: SchemaType.OBJECT,
              properties: {
                keyword: { type: SchemaType.STRING, description: '키워드', nullable: false },
                count: { type: SchemaType.INTEGER, description: '등장 횟수', nullable: false },
              },
              required: ['keyword', 'count'],
            },
          },
          negative: {
            type: SchemaType.ARRAY,
            description: '부정적인 키워드 리스트',
            items: {
              type: SchemaType.OBJECT,
              properties: {
                keyword: { type: SchemaType.STRING, description: '키워드', nullable: false },
                count: { type: SchemaType.INTEGER, description: '등장 횟수', nullable: false },
              },
              required: ['keyword', 'count'],
            },
          },
        },
      };

      const model = this.genAI.getGenerativeModel({
        model: 'gemini-1.5-flash',
        generationConfig: {
          responseMimeType: 'application/json',
          responseSchema: keywordSchema,
        },
      });

      const promptText = `다음 리뷰에서 긍정적/부정적 키워드를 추출하고, 각 키워드가 등장한 횟수도 포함해 주세요. 추가적으로 중복되는 키워드가 없었으면 해. 예를들어 '친절했지만, 친절하고, 친절하다' 이런 키워드는 '친절'로 추출해줘
  
      리뷰 텍스트:
      "${reviewsText}"`;

      const result = await model.generateContent({
        contents: [{ role: 'user', parts: [{ text: promptText }] }],
      });

      const responseText = await result.response.text();

      let parsedResponse;
      try {
        parsedResponse = JSON.parse(responseText);
      } catch (error) {
        console.error('JSON 파싱 오류:', error);
        return { positive: [], negative: [] };
      }

      return parsedResponse;
    } catch (error) {
      console.error('Error extracting keywords:', error);
      return { positive: [], negative: [] };
    }
  }
}

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
}

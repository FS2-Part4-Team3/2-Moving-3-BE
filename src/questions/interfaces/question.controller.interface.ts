import { Question } from '#questions/question.types.js';

export interface IQuestionController {
  getQuestion: (id: string) => Promise<Question>;
}

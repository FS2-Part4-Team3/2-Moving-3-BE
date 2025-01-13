import { Question, QuestionPostDTO } from '#questions/question.types.js';

export interface IQuestionController {
  getQuestion: (id: string) => Promise<Question>;
  patchQuestion: (id: string, body: Partial<QuestionPostDTO>) => Promise<Question>;
  deleteQuestion: (id: string) => Promise<Question>;
}

import { Question, QuestionInputDTO } from '#questions/question.types.js';

export interface IQuestionController {
  getQuestion: (id: string) => Promise<Question>;
  patchQuestion: (id: string, body: Partial<QuestionInputDTO>) => Promise<Question>;
  deleteQuestion: (id: string) => Promise<Question>;
}

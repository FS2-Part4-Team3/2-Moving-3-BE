import { QuestionPatchDTO } from '#questions/types/question.dto.js';
import { Question } from '#questions/types/question.types.js';

export interface IQuestionController {
  getQuestion: (id: string) => Promise<Question>;
  patchQuestion: (id: string, body: QuestionPatchDTO) => Promise<Question>;
  deleteQuestion: (id: string) => Promise<Question>;
}

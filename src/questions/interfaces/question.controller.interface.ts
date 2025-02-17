import { QuestionPatchDTO } from '#questions/types/question.dto.js';
import { IQuestion } from '#questions/types/question.types.js';

export interface IQuestionController {
  getQuestion: (id: string) => Promise<IQuestion>;
  patchQuestion: (id: string, body: QuestionPatchDTO) => Promise<IQuestion>;
  deleteQuestion: (id: string) => Promise<IQuestion>;
}

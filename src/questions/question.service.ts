import { IQuestionService } from '#questions/interfaces/question.service.interface.js';
import { Injectable } from '@nestjs/common';

@Injectable()
export class QuestionService implements IQuestionService {
  constructor() {}
}

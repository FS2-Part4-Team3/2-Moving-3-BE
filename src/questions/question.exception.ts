import ExceptionMessages from '#exceptions/exception.messages.js';
import { NotFoundException } from '#exceptions/http.exception.js';

export class QuestionNotFoundException extends NotFoundException {
  constructor() {
    super(ExceptionMessages.QUESTION_NOT_FOUND);
  }
}

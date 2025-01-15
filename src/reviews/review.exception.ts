import ExceptionMessages from '#exceptions/exception.messages.js';
import { NotFoundException } from '#exceptions/http.exception.js';

export class ReviewNotFoundException extends NotFoundException {
  constructor() {
    super(ExceptionMessages.REVIEW_NOT_FOUND);
  }
}

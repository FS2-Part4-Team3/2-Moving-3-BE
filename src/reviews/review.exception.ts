import ExceptionMessages from '#exceptions/exception.messages.js';
import { BadRequestException, NotFoundException } from '#exceptions/http.exception.js';

export class ReviewNotFoundException extends NotFoundException {
  constructor() {
    super(ExceptionMessages.REVIEW_NOT_FOUND);
  }
}

export class ReviewAlreadyExistsException extends BadRequestException {
  constructor() {
    super(ExceptionMessages.REVIEW_ALREADY_SUBMITTED);
  }
}

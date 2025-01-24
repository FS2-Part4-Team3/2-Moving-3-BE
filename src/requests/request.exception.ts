import ExceptionMessages from '#exceptions/exception.messages.js';
import { BadRequestException } from '#exceptions/http.exception.js';

export class RequestNotFoundException extends BadRequestException {
  constructor() {
    super(ExceptionMessages.REQUEST_NOT_FOUND);
  }
}

export class AlreadyRequestedException extends BadRequestException {
  constructor() {
    super(ExceptionMessages.ALREADY_REQUESTED);
  }
}

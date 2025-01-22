import ExceptionMessages from '#exceptions/exception.messages.js';
import { BadRequestException, NotFoundException } from '#exceptions/http.exception.js';

export class UserNotFoundException extends NotFoundException {
  constructor() {
    super(ExceptionMessages.USER_NOT_FOUND);
  }
}

export class UserInvalidTokenException extends BadRequestException {
  constructor() {
    super(ExceptionMessages.INVALID_TOKEN);
  }
}

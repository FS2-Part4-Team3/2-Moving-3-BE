import ExceptionMessages from '#exceptions/exception.messages.js';
import { NotFoundException } from '#exceptions/http.exception.js';

export class UserNotFoundException extends NotFoundException {
  constructor() {
    super(ExceptionMessages.USER_NOT_FOUND);
  }
}

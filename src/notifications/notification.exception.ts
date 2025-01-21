import ExceptionMessages from '#exceptions/exception.messages.js';
import { BadRequestException } from '#exceptions/http.exception.js';

export class NotificationInvalidTargetException extends BadRequestException {
  constructor() {
    super(ExceptionMessages.INVALID_USER_TYPE);
  }
}

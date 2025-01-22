import ExceptionMessages from '#exceptions/exception.messages.js';
import { BadRequestException } from '#exceptions/http.exception.js';

export class NotificationInvalidTargetException extends BadRequestException {
  constructor() {
    super(ExceptionMessages.INVALID_USER_TYPE);
  }
}

export class NotificationInvalidTypeException extends BadRequestException {
  constructor() {
    super(ExceptionMessages.INVALID_NOTIFICATION_TYPE);
  }
}

export class NotificationInvalidRelationException extends BadRequestException {
  constructor(message: string = ExceptionMessages.BAD_REQUEST) {
    super(message);
  }
}

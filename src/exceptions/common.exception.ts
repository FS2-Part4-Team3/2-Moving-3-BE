import ExceptionMessages from '#exceptions/exception.messages.js';
import { BadRequestException, InternalServerErrorException } from '#exceptions/http.exception.js';

export class UncaughtException extends InternalServerErrorException {
  constructor() {
    super(ExceptionMessages.UN_CATCHED_EXCEPTION);
  }
}

export class UuidException extends BadRequestException {
  constructor() {
    super(ExceptionMessages.ID_FORMAT);
  }
}

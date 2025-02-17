import ExceptionMessages from '#exceptions/exception.messages.js';
import { BadRequestException, InternalServerErrorException } from '#exceptions/http.exception.js';

export class MoveInfoNotFoundException extends BadRequestException {
  constructor() {
    super(ExceptionMessages.MOVEINFO_NOT_FOUND);
  }
}

export class ReceivedEstimationException extends BadRequestException {
  constructor() {
    super(ExceptionMessages.RECEIVED_ESTIMATE);
  }
}

export class AutoCompleteException extends InternalServerErrorException {
  constructor() {
    super(ExceptionMessages.AUTO_COMPLETE_ERROR);
  }
}

export class MoveInfoAlreadyExistsException extends BadRequestException {
  constructor() {
    super(ExceptionMessages.MOVEINFO_ALREADY_EXISTS);
  }
}

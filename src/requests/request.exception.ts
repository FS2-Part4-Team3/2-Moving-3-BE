import ExceptionMessages from '#exceptions/exception.messages.js';
import { BadRequestException, ForbiddenException } from '#exceptions/http.exception.js';

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

export class EstimationAlreadyReceivedException extends BadRequestException {
  constructor() {
    super(ExceptionMessages.ESTIMATION_ALREADY_RECEIVED);
  }
}

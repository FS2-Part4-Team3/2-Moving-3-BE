import ExceptionMessages from '#exceptions/exception.messages.js';
import { BadRequestException, NotFoundException } from '#exceptions/http.exception.js';

export class EstimationNotFoundException extends NotFoundException {
  constructor() {
    super(ExceptionMessages.ESTIMATION_NOT_FOUND);
  }
}

export class EstimateAlreadyExistsException extends BadRequestException {
  constructor() {
    super(ExceptionMessages.ALREADY_ESTIMATION);
  }
}

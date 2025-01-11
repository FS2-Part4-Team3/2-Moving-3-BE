import ExceptionMessages from '#exceptions/exception.messages.js';
import { BadRequestException, NotFoundException } from '#exceptions/http.exception.js';

export class DriverNotFoundException extends NotFoundException {
  constructor() {
    super(ExceptionMessages.DRIVER_NOT_FOUND);
  }
}

export class DriverIsLikedException extends BadRequestException {
  constructor() {
    super(ExceptionMessages.ALREADY_LIKED);
  }
}

export class DriverIsUnLikedException extends BadRequestException {
  constructor() {
    super(ExceptionMessages.ALREADY_UNLIKED);
  }
}

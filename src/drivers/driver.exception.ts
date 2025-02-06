import ExceptionMessages from '#exceptions/exception.messages.js';
import {
  BadRequestException,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '#exceptions/http.exception.js';

export class DriverNotFoundException extends NotFoundException {
  constructor() {
    super(ExceptionMessages.DRIVER_NOT_FOUND);
  }
}

export class DriverInvalidTokenException extends BadRequestException {
  constructor() {
    super(ExceptionMessages.INVALID_TOKEN);
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

export class DriverInvalidEntityException extends InternalServerErrorException {
  constructor() {
    super();
  }
}

export class DriverUnauthorizedException extends UnauthorizedException {
  constructor() {
    super(ExceptionMessages.DRIVER_UNAUTHORIZED);
  }
}

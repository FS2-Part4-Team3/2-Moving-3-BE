import { BaseException } from '#exceptions/base.exception.js';
import ExceptionMessages from '#exceptions/exception.messages.js';
import { HttpStatus } from '@nestjs/common';

export class BadRequestException extends BaseException {
  constructor(message: string = ExceptionMessages.BAD_REQUEST) {
    super({ message }, HttpStatus.BAD_REQUEST);
  }
}

export class UnauthorizedException extends BaseException {
  constructor(message: string = ExceptionMessages.UNAUTHORIZED) {
    super({ message }, HttpStatus.UNAUTHORIZED);
  }
}

export class ForbiddenException extends BaseException {
  constructor(message: string = ExceptionMessages.FORBIDDEN) {
    super({ message }, HttpStatus.FORBIDDEN);
  }
}

export class NotFoundException extends BaseException {
  constructor(message: string = ExceptionMessages.NOT_FOUND) {
    super({ message }, HttpStatus.NOT_FOUND);
  }
}

export class InternalServerErrorException extends BaseException {
  constructor(message: string = ExceptionMessages.INTERNAL_SERVER_ERROR) {
    super({ message }, HttpStatus.INTERNAL_SERVER_ERROR);
  }
}

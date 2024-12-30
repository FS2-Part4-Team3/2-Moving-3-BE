import ExceptionMessages from '#exceptions/exception.messages.js';
import { BadRequestException, NotFoundException, UnauthorizedException } from '#exceptions/http.exception.js';

export class AuthWrongCredentialException extends UnauthorizedException {
  constructor() {
    super(ExceptionMessages.WRONG_CREDENTIAL);
  }
}

export class AuthInvalidTokenException extends UnauthorizedException {
  constructor() {
    super(ExceptionMessages.INVALID_TOKEN);
  }
}

export class AuthUserAlreadyExistException extends BadRequestException {
  constructor() {
    super(ExceptionMessages.USER_ALREADY_EXIST);
  }
}

export class AuthInvalidAccessTokenException extends NotFoundException {
  constructor() {
    super(ExceptionMessages.INVALID_TOKEN);
  }
}

export class AuthInvalidRefreshTokenException extends NotFoundException {
  constructor() {
    super(ExceptionMessages.INVALID_TOKEN);
  }
}

import ExceptionMessages from '#exceptions/exception.messages.js';
import { WsException } from '@nestjs/websockets';

export class WSInvalidTokenException extends WsException {
  constructor() {
    super(ExceptionMessages.INVALID_TOKEN);
  }
}

export class WSTokenNotFoundException extends WsException {
  constructor() {
    super(ExceptionMessages.TOKEN_NOT_FOUND);
  }
}

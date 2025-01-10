import ExceptionMessages from '#exceptions/exception.messages.js';
import { BadRequestException } from '#exceptions/http.exception.js';

export class MoveInfoNotFoundException extends BadRequestException {
  constructor() {
    super(ExceptionMessages.MOVEINFO_NOT_FOUND);
  }
}

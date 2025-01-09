import ExceptionMessages from '#exceptions/exception.messages.js';
import { NotFoundException } from '#exceptions/http.exception.js';

export class DriverNotFoundException extends NotFoundException {
  constructor() {
    super(ExceptionMessages.DRIVER_NOT_FOUND);
  }
}

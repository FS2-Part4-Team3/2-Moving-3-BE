import ExceptionMessages from '#exceptions/exception.messages.js';
import { NotFoundException } from '#exceptions/http.exception.js';

export class EstimationNotFoundException extends NotFoundException {
  constructor() {
    super(ExceptionMessages.ESTIMATION_NOT_FOUND);
  }
}

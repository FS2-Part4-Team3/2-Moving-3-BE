import ExceptionMessages from '#exceptions/exception.messages.js';
import { BadRequestException, NotFoundException } from '#exceptions/http.exception.js';

export class EstimationNotFoundException extends NotFoundException {
  constructor() {
    super(ExceptionMessages.ESTIMATION_NOT_FOUND);
  }
}

//견적이 이미 있을 때
export class EstimateAlreadyExistsException extends BadRequestException {
  constructor() {
    super(ExceptionMessages.ALREADY_ESTIMATION);
  }
}

// moveinfo를 찾을 수 없을 때
export class MoveInfoNotFoundException extends NotFoundException {
  constructor() {
    super(ExceptionMessages.MOVEINFO_NOT_FOUND);
  }
}

// moveinfo가 새로운 견적을 받을 수 없을 때..
export class MoveInfoNotOpenException extends BadRequestException {
  constructor() {
    super(ExceptionMessages.MOVE_INFO_NOT_OPEN);
  }
}

// 요청이 거부(반려) 되었을 때
export class RequestRejectedException extends BadRequestException {
  constructor() {
    super(ExceptionMessages.REQUEST_REJECTED);
  }
}

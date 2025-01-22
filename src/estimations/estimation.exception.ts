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

// 해당 드라이버아이디에 지정요청이 없을 때
export class PendingRequestNotFoundException extends BadRequestException {
  constructor() {
    super(ExceptionMessages.PENDING_REQUEST_NOT_FOUND);
  }
}

// 요청이 거부(반려) 되었을 때
export class RequestRejectedException extends BadRequestException {
  constructor() {
    super(ExceptionMessages.REQUEST_REJECTED);
  }
}

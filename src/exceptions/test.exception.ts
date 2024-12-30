import { BaseException } from '#exceptions/base.exception.js';
import { HttpStatus } from '@nestjs/common';

export class TestException extends BaseException {
  constructor(message: string = 'test error') {
    super({ message }, HttpStatus.INTERNAL_SERVER_ERROR);
  }
}

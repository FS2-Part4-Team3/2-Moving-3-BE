import { HttpException } from '@nestjs/common';

interface IBaseException {
  message: string;
  statusCode: number;
  timestamp: string;
  path: string;
}

export class BaseException extends HttpException implements IBaseException {
  constructor({ message }: Partial<IBaseException>, statusCode: number) {
    super(message, statusCode);
    this.message = message;
    this.statusCode = statusCode;
  }

  message: string;
  statusCode: number;
  timestamp: string;
  path: string;
}

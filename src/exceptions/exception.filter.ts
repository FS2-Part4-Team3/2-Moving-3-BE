import { BaseException } from '#exceptions/base.exception.js';
import { UncaughtException } from '#exceptions/common.exception.js';
import formatTimestamp from '#utils/format-timestamp.js';
import { isValidJSON } from '#utils/isValidJSON.js';
import logger from '#utils/logger.js';
import stringifyJson from '#utils/stringifyJson.js';
import { ArgumentsHost, Catch, ExceptionFilter, HttpException } from '@nestjs/common';
import { Request, Response } from 'express';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: Error, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let res;
    if (exception instanceof BaseException) {
      res = exception;
    } else if (exception instanceof HttpException) {
      res = exception.getResponse();
    } else {
      const info = isValidJSON(exception) ? stringifyJson(exception) : exception;
      logger.error(`exception info: ${info}`);
      res = new UncaughtException();
    }

    res.timestamp = formatTimestamp(new Date());
    res.path = request.url;

    response.status(res.statusCode).json({
      statusCode: res.statusCode,
      message: res.message,
      timestamp: res.timestamp,
      path: res.path,
    });
  }
}

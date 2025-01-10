import { IStorage } from '#types/common.types.js';
import isEmpty from '#utils/isEmpty.js';
import logger from '#utils/logger.js';
import loggingError from '#utils/loggingError.js';
import stringifyJson from '#utils/stringifyJson.js';
import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { AsyncLocalStorage } from 'async_hooks';
import { Observable, tap } from 'rxjs';

enum MessageType {
  Request = 'Request',
  Response = 'Response',
}

enum LogType {
  Headers = 'Headers',
  Body = 'Body',
  Cookies = 'Cookies',
}

@Injectable()
export class LogInterceptor implements NestInterceptor {
  constructor(private readonly als: AsyncLocalStorage<IStorage>) {}

  intercept(context: ExecutionContext, next: CallHandler<any>): Observable<any> | Promise<Observable<any>> {
    const req = context.switchToHttp().getRequest();
    const res = context.switchToHttp().getResponse();
    const { method, url, headers, body, cookies } = req;
    const store = this.als.getStore();

    logger.info(`Incoming Request: ${method} ${url}`);
    if (store?.userId) logger.info(`User ID: ${store.userId}`);

    this.logHeaders(headers, MessageType.Request);
    this.logBody(body, MessageType.Request);
    this.logCookies(cookies, MessageType.Request);

    return next.handle().pipe(
      tap({
        next: resBody => {
          const { 'set-cookie': cookies, ...headers } = res.getHeaders();
          this.logHeaders(headers, MessageType.Response);
          this.logBody(resBody, MessageType.Response);
          this.logCookies(cookies, MessageType.Response);
        },
        error: err => {
          this.logError(err);
        },
      }),
    );
  }

  logHeaders(headers: any, type: MessageType) {
    const filters = ['cookie', 'set-cookie'];
    this.logBase(headers, type, LogType.Headers, filters);
  }

  logBody(body: any, type: MessageType) {
    const filters = ['password', 'salt'];
    this.logBase(body, type, LogType.Body, filters);
  }

  logCookies(cookies: any, type: MessageType) {
    const filters = [];
    this.logBase(cookies, type, LogType.Cookies, filters);
  }

  logError(error: any) {
    if (isEmpty(error)) return;

    loggingError(error);
  }

  logBase(target: any, messageType: MessageType, logType: LogType, filters: string[]) {
    if (isEmpty(target)) return;
    if (typeof target !== 'object') return logger.info(`${messageType} ${logType}: ${target}`);

    const filtered = { ...target };
    for (const filter of filters) {
      delete filtered[filter];
    }

    logger.info(`${messageType} ${logType}: ${stringifyJson(filtered)}`);
  }
}

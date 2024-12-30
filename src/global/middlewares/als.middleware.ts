import { IStorage } from '#types/common.types.js';
import { Injectable, NestMiddleware } from '@nestjs/common';
import { AsyncLocalStorage } from 'async_hooks';
import { NextFunction, Request, Response } from 'express';

@Injectable()
export class AlsMiddleware implements NestMiddleware {
  constructor(private readonly als: AsyncLocalStorage<IStorage>) {}

  use(req: Request, res: Response, next: NextFunction) {
    this.als.run({}, () => next());
  }
}

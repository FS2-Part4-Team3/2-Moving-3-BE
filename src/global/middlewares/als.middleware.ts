import { ALS } from '#types/common.types.js';
import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';

@Injectable()
export class AlsMiddleware implements NestMiddleware {
  constructor(private readonly als: ALS) {}

  use(req: Request, res: Response, next: NextFunction) {
    this.als.run({}, () => next());
  }
}

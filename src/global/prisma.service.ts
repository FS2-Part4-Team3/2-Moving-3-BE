import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { prismaSoftDeleteMiddleware } from './middlewares/softDelete.middleware.js';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  constructor() {
    super();

    this.$use(prismaSoftDeleteMiddleware());
  }

  async onModuleInit() {
    await this.$connect();
  }
}

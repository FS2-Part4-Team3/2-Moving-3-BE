import { Module } from '@nestjs/common';
import { PrismaService } from '#global/prisma.service.js';

@Module({
  providers: [PrismaService],
  exports: [PrismaService],
})
export class DBModule {}

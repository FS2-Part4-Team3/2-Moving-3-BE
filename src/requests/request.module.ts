import { DBModule } from '#global/db.module.js';
import { RequestController } from '#requests/request.controller.js';
import { RequestRepository } from '#requests/request.repository.js';
import { RequestService } from '#requests/request.service.js';
import { Module } from '@nestjs/common';

@Module({
  imports: [DBModule],
  controllers: [RequestController],
  providers: [RequestService, RequestRepository],
})
export class RequestModule {}

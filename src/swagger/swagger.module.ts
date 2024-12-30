import { SwaggerController } from '#swagger/swagger.controller.js';
import { SwaggerService } from '#swagger/swagger.service.js';
import { Module } from '@nestjs/common';

@Module({
  controllers: [SwaggerController],
  providers: [SwaggerService],
  exports: [SwaggerService],
})
export class SwaggerModule {}

import { port } from '#configs/common.config.js';
import { HttpExceptionFilter } from '#exceptions/exception.filter.js';
import { AppModule } from '#global/app.module.js';
import { SwaggerService } from '#swagger/swagger.service.js';
import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({ credentials: true, origin: true });
  app.use(cookieParser());
  app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalPipes(new ValidationPipe());

  const swaggerService = app.get(SwaggerService);
  swaggerService.setupSwagger(app);

  await app.listen(port);
}
bootstrap();

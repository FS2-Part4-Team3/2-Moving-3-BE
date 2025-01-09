import { AuthModule } from '#auth/auth.module.js';
import jwtConfig from '#configs/jwt.config.js';
import { postgresConfig } from '#configs/postgres.config.js';
import { DriverModule } from '#drivers/driver.module.js';
import { EstimationModule } from '#estimations/estimation.module.js';
import { AppController } from '#global/app.controller.js';
import { DBModule } from '#global/db.module.js';
import { DevController } from '#global/dev.controller.js';
import { LogInterceptor } from '#global/interceptors/log.interceptor.js';
import { AlsMiddleware } from '#global/middlewares/als.middleware.js';
import { StorageModule } from '#global/storage.module.js';
import { MoveModule } from '#move/move.module.js';
import { QuestionModule } from '#questions/question.module.js';
import { RequestModule } from '#requests/request.module.js';
import { ReviewModule } from '#reviews/review.module.js';
import { SwaggerModule } from '#swagger/swagger.module.js';
import { UserModule } from '#users/user.module.js';
import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_INTERCEPTOR } from '@nestjs/core';

@Module({
  imports: [
    DBModule,
    AuthModule,
    DriverModule,
    MoveModule,
    QuestionModule,
    RequestModule,
    ReviewModule,
    EstimationModule,
    UserModule,
    SwaggerModule,
    StorageModule,
    ConfigModule.forRoot({ isGlobal: true, load: [jwtConfig, postgresConfig] }),
  ],
  controllers: [AppController, DevController],
  providers: [{ provide: APP_INTERCEPTOR, useClass: LogInterceptor }],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AlsMiddleware).forRoutes('*');
  }
}

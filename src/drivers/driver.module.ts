import { DriverController } from '#drivers/driver.controller.js';
import { DriverRepository } from '#drivers/driver.repository.js';
import { DriverService } from '#drivers/driver.service.js';
import { DBModule } from '#global/db.module.js';
import { GuardModule } from '#guards/guard.module.js';
import { forwardRef, Module } from '@nestjs/common';

@Module({
  imports: [DBModule, forwardRef(() => GuardModule)],
  controllers: [DriverController],
  providers: [DriverService, DriverRepository],
  exports: [DriverRepository, DriverService],
})
export class DriverModule {}

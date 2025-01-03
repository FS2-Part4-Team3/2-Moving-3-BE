import { DriverController } from '#drivers/driver.controller.js';
import { DriverRepository } from '#drivers/driver.repository.js';
import { DriverService } from '#drivers/driver.service.js';
import { DBModule } from '#global/db.module.js';
import { Module } from '@nestjs/common';

@Module({
  imports: [DBModule],
  controllers: [DriverController],
  providers: [DriverService, DriverRepository],
})
export class DriverModule {}

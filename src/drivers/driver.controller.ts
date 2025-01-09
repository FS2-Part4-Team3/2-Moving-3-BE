import { DriverService } from '#drivers/driver.service.js';
import { IDriverController } from '#drivers/interfaces/driver.controller.interface.js';
import { Controller, Get, Param } from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';

@Controller('drivers')
export class DriverController implements IDriverController {
  constructor(private readonly driverService: DriverService) {}

  @Get()
  @ApiOperation({ summary: '기사 목록 조회' })
  async getDrivers() {}

  @Get(':id')
  @ApiOperation({ summary: '기사 상세 조회' })
  async getDriver(@Param('id') id: string) {
    const driver = await this.driverService.findDriver(id);

    return driver;
  }
}

import { IDriverController } from '#drivers/interfaces/driver.controller.interface.js';
import { Controller, Get } from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';

@Controller('drivers')
export class DriverController implements IDriverController {
  constructor() {}

  @Get()
  @ApiOperation({ summary: '기사 목록 조회' })
  async getDrivers() {}

  @Get(':id')
  @ApiOperation({ summary: '기사 상세 조회' })
  async getDriver() {}
}

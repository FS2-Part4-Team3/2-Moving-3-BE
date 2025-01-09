import { AccessTokenGuard } from '#auth/guards/access-token.guard.js';
import { DriverService } from '#drivers/driver.service.js';
import { IDriverController } from '#drivers/interfaces/driver.controller.interface.js';
import { Controller, Delete, Get, Param, Post, UseGuards } from '@nestjs/common';
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

  @Post(':id/like')
  @UseGuards(AccessTokenGuard)
  @ApiOperation({ summary: '기사 찜하기' })
  async postLikeDriver(@Param('id') id: string) {
    const driver = await this.driverService.likeDriver(id);

    return driver;
  }

  @Delete(':id/like')
  @UseGuards(AccessTokenGuard)
  @ApiOperation({ summary: '기사 찜하기' })
  async deleteLikeDriver(@Param('id') id: string) {
    const driver = await this.driverService.unlikeDriver(id);

    return driver;
  }
}

import { AccessTokenGuard } from '#auth/guards/access-token.guard.js';
import { DriverService } from '#drivers/driver.service.js';
import { IDriverController } from '#drivers/interfaces/driver.controller.interface.js';
import { SortOrder } from '#types/options.type.js';
import { GetQueries } from '#types/queries.type.js';
import { Controller, Delete, Get, Param, Post, Query, UseGuards } from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';

@Controller('drivers')
export class DriverController implements IDriverController {
  constructor(private readonly driverService: DriverService) {}

  @Get()
  @ApiOperation({ summary: '기사 목록 조회' })
  async getDrivers(@Query() query: GetQueries) {
    const { page = 1, pageSize = 10, orderBy = SortOrder.Latest, keyword = '' } = query;
    const options = { page, pageSize, orderBy, keyword };

    const drivers = await this.driverService.findDrivers(options);

    return drivers;
  }

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

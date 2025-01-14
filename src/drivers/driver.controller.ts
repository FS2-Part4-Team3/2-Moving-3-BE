import { FilteredDriverOutputDTO } from '#auth/auth.types.js';
import { DriverService } from '#drivers/driver.service.js';
import { DriverPatchDTO } from '#drivers/driver.types.js';
import { IDriverController } from '#drivers/interfaces/driver.controller.interface.js';
import { AccessTokenGuard } from '#guards/access-token.guard.js';
import { SortOrder } from '#types/options.type.js';
import { GetQueries } from '#types/queries.type.js';
import { Body, Controller, Delete, Get, HttpStatus, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiParam, ApiResponse, getSchemaPath } from '@nestjs/swagger';

@Controller('drivers')
export class DriverController implements IDriverController {
  constructor(private readonly driverService: DriverService) {}

  @Get()
  @ApiOperation({ summary: '기사 목록 조회' })
  @ApiResponse({
    status: HttpStatus.OK,
    schema: {
      type: 'array',
      items: {
        $ref: getSchemaPath(FilteredDriverOutputDTO),
      },
    },
  })
  async getDrivers(@Query() query: GetQueries) {
    const { page = 1, pageSize = 10, orderBy = SortOrder.Latest, keyword = '' } = query;
    const options = { page, pageSize, orderBy, keyword };

    const drivers = await this.driverService.findDrivers(options);

    return drivers;
  }

  @Get(':id')
  @ApiOperation({ summary: '기사 상세 조회' })
  @ApiParam({ name: 'id', description: '기사 ID', type: 'string' })
  @ApiResponse({
    status: HttpStatus.OK,
    type: FilteredDriverOutputDTO,
  })
  async getDriver(@Param('id') id: string) {
    const driver = await this.driverService.findDriver(id);

    return driver;
  }

  @Patch('update')
  @UseGuards(AccessTokenGuard)
  @ApiOperation({ summary: '기사 정보 수정' })
  async patchUser(@Body() body: DriverPatchDTO) {
    const user = await this.driverService.updateDriver(body);

    return user;
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
  @ApiOperation({ summary: '기사 찜하기 해제' })
  async deleteLikeDriver(@Param('id') id: string) {
    const driver = await this.driverService.unlikeDriver(id);

    return driver;
  }
}

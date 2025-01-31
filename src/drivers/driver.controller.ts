import { FilteredDriverOutputDTO } from '#auth/types/filtered.driver.dto.js';
import { DriverService } from '#drivers/driver.service.js';
import { IDriverController } from '#drivers/interfaces/driver.controller.interface.js';
import { DriverPatchDTO } from '#drivers/types/driver.dto.js';
import { AccessTokenGuard } from '#guards/access-token.guard.js';
import { DriverSortOrder } from '#types/options.type.js';
import { DriversGetQueries } from '#types/queries.type.js';
import {
  Body,
  Controller,
  DefaultValuePipe,
  Delete,
  Get,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiParam, ApiQuery, ApiResponse, getSchemaPath } from '@nestjs/swagger';

@Controller('drivers')
export class DriverController implements IDriverController {
  constructor(private readonly driverService: DriverService) {}

  @Get()
  @ApiOperation({ summary: '기사 목록 조회' })
  @ApiQuery({ name: 'orderBy', enum: DriverSortOrder })
  @ApiResponse({
    status: HttpStatus.OK,
    schema: {
      type: 'array',
      items: {
        $ref: getSchemaPath(FilteredDriverOutputDTO),
      },
    },
  })
  async getDrivers(@Query() query: DriversGetQueries) {
    const { page = 1, pageSize = 10, orderBy, keyword = '', area, serviceType } = query;
    const options = { page, pageSize, orderBy, keyword, area, serviceType };

    const drivers = await this.driverService.findDrivers(options);

    return drivers;
  }

  @Get('like')
  @UseGuards(AccessTokenGuard)
  @ApiBearerAuth('accessToken')
  @ApiOperation({ summary: '찜한 기사 조회' })
  @ApiQuery({
    name: 'page',
    required: false,
    type: Number,
  })
  @ApiQuery({
    name: 'pageSize',
    required: false,
    type: Number,
  })
  @ApiResponse({
    status: HttpStatus.OK,
    schema: {
      type: 'array',
      items: {
        $ref: getSchemaPath(FilteredDriverOutputDTO),
      },
    },
  })
  async getLikedDrivers(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('pageSize', new DefaultValuePipe(3), ParseIntPipe) pageSize: number,
  ) {
    const options = { page, pageSize, orderBy: null, keyword: '', area: null, serviceType: null };

    const drivers = await this.driverService.findLikedDrivers(options);

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
  @ApiBearerAuth('accessToken')
  @ApiOperation({ summary: '기사 정보 수정' })
  @ApiResponse({
    status: HttpStatus.OK,
    type: FilteredDriverOutputDTO,
  })
  async patchDriver(@Body() body: DriverPatchDTO) {
    const driver = await this.driverService.updateDriver(body);

    return driver;
  }

  @Get(':id/like')
  @UseGuards(AccessTokenGuard)
  @ApiBearerAuth('accessToken')
  @ApiOperation({ summary: '기사 찜 여부' })
  @ApiParam({ name: 'id', type: 'string' })
  @ApiResponse({
    status: HttpStatus.OK,
    type: Boolean,
  })
  async getIsLiked(@Param('id') id: string) {
    const isLiked = await this.driverService.isLikedDriver(id);

    return isLiked;
  }

  @Post(':id/like')
  @UseGuards(AccessTokenGuard)
  @ApiBearerAuth('accessToken')
  @ApiOperation({ summary: '기사 찜하기' })
  @ApiParam({ name: 'id', type: 'string' })
  @ApiResponse({
    status: HttpStatus.OK,
    type: FilteredDriverOutputDTO,
  })
  async postLikeDriver(@Param('id') id: string) {
    const driver = await this.driverService.likeDriver(id);

    return driver;
  }

  @Delete(':id/like')
  @UseGuards(AccessTokenGuard)
  @ApiBearerAuth('accessToken')
  @ApiOperation({ summary: '기사 찜하기 해제' })
  @ApiParam({ name: 'id', type: 'string' })
  @ApiResponse({
    status: HttpStatus.OK,
    type: FilteredDriverOutputDTO,
  })
  async deleteLikeDriver(@Param('id') id: string) {
    const driver = await this.driverService.unlikeDriver(id);

    return driver;
  }
}

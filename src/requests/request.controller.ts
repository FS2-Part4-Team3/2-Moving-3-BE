import { IRequestController } from '#requests/interfaces/request.controller.interface.js';
import { Controller, Delete, Get, Param, Post, Query } from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';
import { RequestService } from './request.service.js';
import { FindOptions } from '#types/options.type.js';

@Controller('requests')
export class RequestController implements IRequestController {
  constructor(private readonly requestService: RequestService) {}

  @Get()
  @ApiOperation({ summary: '요청 목록 조회(유저 기준)' })
  async getRequests() {}

  @Get('driver/:id')
  @ApiOperation({ summary: '요청 목록 조회(기사 기준)' })
  async getRequestsForDriver(@Param('id') id: string, @Query() options: FindOptions) {
    const request = await this.requestService.getRequestsForDriver(id, options);

    return request;
  }

  @Get(':id')
  @ApiOperation({ summary: '요청 상세 조회' })
  async getRequest() {}

  @Post()
  @ApiOperation({ summary: '요청 생성' })
  async postRequest() {}

  @Delete(':id')
  @ApiOperation({ summary: '요청 취소(유저)' })
  async deleteRequest() {}
}

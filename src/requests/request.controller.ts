import { AccessTokenGuard } from '#guards/access-token.guard.js';
import { IRequestController } from '#requests/interfaces/request.controller.interface.js';
import { Controller, Delete, Get, HttpStatus, Param, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger';
import { RequestService } from './request.service.js';
import { BaseRequestOutputDTO, CheckRequestOutputDTO, RequestOutputDTO } from './types/request.dto.js';

@Controller('requests')
export class RequestController implements IRequestController {
  constructor(private readonly requestService: RequestService) {}

  @Get('check/:driverId')
  @UseGuards(AccessTokenGuard)
  @ApiBearerAuth('accessToken')
  @ApiOperation({ summary: '요청 가능여부 조회' })
  @ApiParam({ name: 'driverId', description: '기사 ID', type: 'string' })
  @ApiResponse({
    status: HttpStatus.OK,
    type: CheckRequestOutputDTO,
  })
  async checkRequest(@Param('driverId') driverId: string) {
    const requset = await this.requestService.checkRequest(driverId);

    return requset;
  }

  @Get(':requestId')
  @UseGuards(AccessTokenGuard)
  @ApiBearerAuth('accessToken')
  @ApiOperation({ summary: '요청 상세 조회' })
  @ApiResponse({
    status: HttpStatus.OK,
    type: RequestOutputDTO,
  })
  async getRequest(@Param('requestId') requestId: string) {
    const request = await this.requestService.getRequest(requestId);

    return request;
  }

  @Post(':driverId')
  @UseGuards(AccessTokenGuard)
  @ApiBearerAuth('accessToken')
  @ApiOperation({ summary: ' 요청 생성 ' })
  @ApiParam({ name: 'driverId', description: '기사 ID', type: 'string' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    type: BaseRequestOutputDTO,
  })
  async postRequest(@Param('driverId') driverId: string) {
    const request = await this.requestService.postRequest(driverId);

    return request;
  }

  @Delete(':requestId')
  @UseGuards(AccessTokenGuard)
  @ApiBearerAuth('accessToken')
  @ApiOperation({ summary: '요청 취소(유저)' })
  @ApiParam({ name: 'requestId', description: '지정견적요청 ID', type: 'string' })
  @ApiResponse({
    status: HttpStatus.OK,
    type: BaseRequestOutputDTO,
  })
  async deleteRequest(@Param('requestId') requestId: string) {
    const request = await this.requestService.deleteRequest(requestId);

    return request;
  }
}

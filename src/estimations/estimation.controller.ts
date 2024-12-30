import { IEstimationController } from '#estimations/interfaces/estimation.controller.interface.js';
import { Controller, Delete, Get, Post } from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';

@Controller('Estimations')
export class EstimationController implements IEstimationController {
  constructor() {}

  @Get()
  @ApiOperation({ summary: '견적 목록 조회' })
  async getEstimations() {}

  @Get(':id')
  @ApiOperation({ summary: '견적 상세 조회' })
  async getEstimation() {}

  @Post(':moveInfoId')
  @ApiOperation({ summary: '견적 생성' })
  async postEstimation() {}

  @Post(':id')
  @ApiOperation({ summary: '견적 수정' })
  async patchEstimation() {}

  @Delete(':id')
  @ApiOperation({ summary: '견적 삭제' })
  async deleteEstimation() {}
}

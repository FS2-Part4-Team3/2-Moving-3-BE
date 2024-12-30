import { IMoveController } from '#move/interfaces/move.controller.interface.js';
import { Controller, Get, Patch, Post } from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';

@Controller('moves')
export class MoveController implements IMoveController {
  constructor() {}

  @Get()
  @ApiOperation({ summary: '이사 정보 목록 조회' })
  async getMoveInfos() {}

  @Get(':id')
  @ApiOperation({ summary: '이사 정보 상세 조회' })
  async getMoveInfo() {}

  @Post()
  @ApiOperation({ summary: '이사 정보 생성' })
  async postMoveInfo() {}

  @Patch(':id')
  @ApiOperation({ summary: '이사 정보 수정' })
  async patchMoveInfo() {}

  @Post(':moveId/confirm/:estimationId')
  @ApiOperation({ summary: '이사 견적 확정' })
  async confirmEstimation() {}
}

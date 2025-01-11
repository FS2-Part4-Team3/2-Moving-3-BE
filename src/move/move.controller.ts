import { AccessTokenGuard } from '#guards/access-token.guard.js';
import { IMoveController } from '#move/interfaces/move.controller.interface.js';
import { FindOptions, RequestFilter } from '#types/options.type.js';
import { Controller, Get, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';
import { MoveService } from './move.service.js';

@Controller('moves')
export class MoveController implements IMoveController {
  constructor(private readonly moveService: MoveService) {}

  @Get()
  @ApiOperation({ summary: '이사 정보 목록 조회' })
  async getMoveInfos(@Query('driverId') driverId?: string, @Query() options?: FindOptions & RequestFilter) {
    const request = await this.moveService.getMoveInfos(driverId, options);

    return request;
  }

  @Get('detail')
  @UseGuards(AccessTokenGuard)
  @ApiOperation({ summary: '이사 정보 상세 조회' })
  async getMoveInfo() {
    const moveInfo = await this.moveService.getMoveInfo();
    return moveInfo;
  }

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

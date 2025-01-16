import { AccessTokenGuard } from '#guards/access-token.guard.js';
import { IMoveController } from '#move/interfaces/move.controller.interface.js';
import { RequestFilter } from '#types/options.type.js';
import { GetQueries } from '#types/queries.type.js';
import { Controller, Get, HttpStatus, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger';
import { MoveService } from './move.service.js';
import { BaseMoveInfoOutputDTO, MoveInfoResponseDTO } from './move.types.js';

@Controller('moves')
export class MoveController implements IMoveController {
  constructor(private readonly moveService: MoveService) {}

  @Get()
  @UseGuards(AccessTokenGuard)
  @ApiBearerAuth('accessToken')
  @ApiOperation({ summary: '이사 정보 목록 조회' })
  @ApiResponse({
    status: HttpStatus.OK,
    type: MoveInfoResponseDTO,
  })
  async getMoveInfos(@Query() options: GetQueries & Partial<RequestFilter>) {
    const request = await this.moveService.getMoveInfos(options);

    return request;
  }

  @Get(':moveInfoId')
  @UseGuards(AccessTokenGuard)
  @ApiBearerAuth('accessToken')
  @ApiOperation({ summary: '이사 정보 상세 조회' })
  @ApiParam({ name: 'moveInfoId', description: '이사정보 ID', type: 'string' })
  @ApiResponse({
    status: HttpStatus.OK,
    type: BaseMoveInfoOutputDTO,
  })
  async getMoveInfo(@Param('moveInfoId') moveInfoId: string) {
    const moveInfo = await this.moveService.getMoveInfo(moveInfoId);
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

import { AccessTokenGuard } from '#guards/access-token.guard.js';
import { IMoveController } from '#move/interfaces/move.controller.interface.js';
import { MoveInfoGetQueries } from '#types/queries.type.js';
import { Body, Controller, Get, HttpStatus, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiParam, ApiQuery, ApiResponse } from '@nestjs/swagger';
import { MoveService } from './move.service.js';
import { BaseMoveInfoOutputDTO, MoveInfo, MoveInfoInputDTO, MoveInfoResponseDTO, MoveInputDTO } from './move.types.js';

@Controller('moves')
export class MoveController implements IMoveController {
  constructor(private readonly moveService: MoveService) {}

  @Get()
  @UseGuards(AccessTokenGuard)
  @ApiBearerAuth('accessToken')
  @ApiOperation({ summary: '이사 정보 목록 조회' })
  @ApiQuery({
    name: 'orderBy',
    required: false,
    type: String,
    description: '정렬 기준 (예: UpcomingMoveDate(이사일 빠른순), RecentRequest(요청일 빠른순))',
  })
  @ApiQuery({ name: 'serviceType', required: false, type: String, description: '서비스 타입 (예: SMALL, HOME, OFFICE)' })
  @ApiQuery({
    name: 'serviceArea',
    required: false,
    type: String,
    description: '서비스 지역 활성화 상태 (예: Active, Inactive)',
  })
  @ApiQuery({
    name: 'designatedRequest',
    required: false,
    type: String,
    description: '지정 요청 활성화 상태 (예: Active, Inactive)',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    type: MoveInfoResponseDTO,
  })
  async getMoveInfos(@Query() query: MoveInfoGetQueries) {
    const request = await this.moveService.getMoveInfos(query);

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
  @UseGuards(AccessTokenGuard)
  @ApiOperation({ summary: '이사 정보 생성' })
  @ApiBody({ type: MoveInputDTO })
  @ApiResponse({
    status: HttpStatus.OK,
    type: BaseMoveInfoOutputDTO
  })
  async postMoveInfo(@Body() moveData: MoveInfoInputDTO): Promise<MoveInfo> {
    const moveInfo = await this.moveService.postMoveInfo(moveData);
    return moveInfo;
  }

  @Patch(':id')
  @ApiOperation({ summary: '이사 정보 수정' })
  async patchMoveInfo() {}

  @Post(':moveId/confirm/:estimationId')
  @ApiOperation({ summary: '이사 견적 확정' })
  async confirmEstimation() {}
}

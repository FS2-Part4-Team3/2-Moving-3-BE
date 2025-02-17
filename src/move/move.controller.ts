import { AccessTokenGuard } from '#guards/access-token.guard.js';
import { IMoveController } from '#move/interfaces/move.controller.interface.js';
import { MoveInfoGetQueries, moveInfoWithEstimationsGetQueries } from '#types/queries.type.js';
import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiParam, ApiQuery, ApiResponse } from '@nestjs/swagger';
import { MoveService } from './move.service.js';
import {
  BaseMoveInfoOutputDTO,
  IsMoveInfoEditableDTO,
  MoveInfoIdDTO,
  MoveInfoResponseDTO,
  MoveInfoWithEstimationsResponseDTO,
  MoveInputDTO,
  MovePatchInputDTO,
} from './types/move.dto.js';
import { InternalServerErrorException } from '#exceptions/http.exception.js';

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
    const moveInfo = await this.moveService.getMoveInfos(query);

    return moveInfo;
  }

  @Get('userMoveInfoId')
  @UseGuards(AccessTokenGuard)
  @ApiBearerAuth('accessToken')
  @ApiOperation({ summary: '유저의 이사정보ID 조회' })
  @ApiResponse({
    status: HttpStatus.OK,
    type: MoveInfoIdDTO,
  })
  async getUserMoveInfoId() {
    const moveInfoId = await this.moveService.getUserMoveInfoId();

    return moveInfoId;
  }

  @Get('check')
  @UseGuards(AccessTokenGuard)
  @ApiBearerAuth('accessToken')
  @ApiOperation({ summary: '이사 정보 등록 가능여부 조회' })
  @ApiResponse({
    status: HttpStatus.OK,
    type: [BaseMoveInfoOutputDTO],
  })
  async checkMoveInfoExistence() {
    const moveInfo = await this.moveService.checkMoveInfoExistence();

    return moveInfo;
  }

  @Get('estimations')
  @UseGuards(AccessTokenGuard)
  @ApiBearerAuth('accessToken')
  @ApiOperation({ summary: '받았던 견적이 있는 이사정보 조회' })
  @ApiResponse({
    status: HttpStatus.OK,
    type: MoveInfoWithEstimationsResponseDTO,
  })
  async getReceivedEstimations(@Query() query: moveInfoWithEstimationsGetQueries) {
    const options = query;
    const moveInfoWithEstimations = await this.moveService.getReceivedEstimations(options);

    return moveInfoWithEstimations;
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

  @Get(':moveInfoId/editability')
  @UseGuards(AccessTokenGuard)
  @ApiBearerAuth('accessToken')
  @ApiOperation({ summary: '이사정보 변경(수정, 삭제) 가능여부 조회' })
  @ApiParam({ name: 'moveInfoId', description: '이사정보 ID', type: 'string' })
  @ApiResponse({
    status: HttpStatus.OK,
    type: IsMoveInfoEditableDTO,
  })
  async getIsMoveInfoEditable(@Param('moveInfoId') moveInfoId: string) {
    const isMoveInfoEditable = await this.moveService.getIsMoveInfoEditable(moveInfoId);

    return isMoveInfoEditable;
  }

  @Post()
  @UseGuards(AccessTokenGuard)
  @ApiOperation({ summary: '이사 정보 생성' })
  @ApiBody({ type: MoveInputDTO })
  @ApiResponse({
    status: HttpStatus.OK,
    type: BaseMoveInfoOutputDTO,
  })
  async postMoveInfo(@Body() moveData: MoveInputDTO) {
    const moveInfo = await this.moveService.postMoveInfo(moveData);
    return moveInfo;
  }

  @Patch(':moveInfoId')
  @UseGuards(AccessTokenGuard)
  @ApiBearerAuth('accessToken')
  @ApiOperation({ summary: '이사 정보 수정' })
  @ApiParam({ name: 'moveInfoId', description: '이사정보 ID', type: 'string' })
  @ApiBody({ type: MovePatchInputDTO })
  @ApiResponse({
    status: HttpStatus.OK,
    type: BaseMoveInfoOutputDTO,
  })
  async patchMoveInfo(@Param('moveInfoId') moveInfoId: string, @Body() body: MovePatchInputDTO) {
    const moveInfo = await this.moveService.patchMoveInfo(moveInfoId, body);

    return moveInfo;
  }

  @Delete(':moveInfoId')
  @UseGuards(AccessTokenGuard)
  @ApiBearerAuth('accessToken')
  @ApiOperation({ summary: '이사 정보 삭제' })
  @ApiParam({ name: 'moveInfoId', description: '이사정보 ID', type: 'string' })
  async deleteMoveInfo(@Param('moveInfoId') moveInfoId: string) {
    const moveInfo = await this.moveService.softDeleteMoveInfo(moveInfoId);

    return moveInfo;
  }

  @Post(':moveInfoId/confirm/:estimationId')
  @HttpCode(HttpStatus.NO_CONTENT)
  @UseGuards(AccessTokenGuard)
  @ApiBearerAuth('accessToken')
  @ApiOperation({ summary: '이사 견적 확정' })
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
  })
  async confirmEstimation(@Param('moveInfoId') moveInfoId: string, @Param('estimationId') estimationId: string): Promise<void> {
    await this.moveService.confirmEstimation(moveInfoId, estimationId);
    return;
  }
}

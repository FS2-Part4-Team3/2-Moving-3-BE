import {
  DriversFindOptions,
  FindOptions,
  MoveInfoFilter,
  moveInfoWithEstimationsFilter,
  OffsetPaginationOptions,
} from '#types/options.type.js';
import { PartialType } from '@nestjs/swagger';

export class GetQueries extends PartialType(FindOptions) {}
export class DriversGetQueries extends PartialType(DriversFindOptions) {}
export class MoveInfoGetQueries extends PartialType(MoveInfoFilter) {}
export class moveInfoWithEstimationsGetQueries extends moveInfoWithEstimationsFilter {}
export class EstimationGetQueries extends PartialType(OffsetPaginationOptions) {}
export class ReviewableGetQueries extends PartialType(OffsetPaginationOptions) {}
export class DriverEstimationsGetQueries extends PartialType(OffsetPaginationOptions) {}

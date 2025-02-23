import {
  DriversFindOptions,
  FindOptions,
  GetReviewKeywordsFilter,
  MoveInfoFilter,
  moveInfoWithEstimationsFilter,
  OffsetPaginationOptions,
} from '#types/options.type.js';
import { PartialType } from '@nestjs/swagger';

export class GetQueries extends PartialType(FindOptions) {}
export class DriversGetQueries extends PartialType(DriversFindOptions) {}
export class MoveInfoGetQueries extends PartialType(MoveInfoFilter) {}
export class moveInfoWithEstimationsGetQueries extends PartialType(moveInfoWithEstimationsFilter) {}
export class EstimationGetQueries extends PartialType(OffsetPaginationOptions) {}
export class ReviewableGetQueries extends PartialType(OffsetPaginationOptions) {}
export class DriverEstimationsGetQueries extends PartialType(OffsetPaginationOptions) {}
export class DriverRejectedEstimations extends PartialType(OffsetPaginationOptions) {}
export class ChatGetQueries extends PartialType(OffsetPaginationOptions) {}
export class ReviewKeywordsGetQueries extends PartialType(GetReviewKeywordsFilter) {}

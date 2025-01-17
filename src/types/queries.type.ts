import { DriversFindOptions, FindOptions, MoveInfoFilter } from '#types/options.type.js';
import { PartialType } from '@nestjs/swagger';

export class GetQueries extends PartialType(FindOptions) {}
export class DriversGetQueries extends PartialType(DriversFindOptions) {}
export class MoveInfoGetQueries extends PartialType(MoveInfoFilter) {}

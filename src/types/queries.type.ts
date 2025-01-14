import { FindOptions } from '#types/options.type.js';
import { PartialType } from '@nestjs/swagger';

export class GetQueries extends PartialType(FindOptions) {}

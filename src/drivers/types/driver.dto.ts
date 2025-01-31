import { DriverEntity, DriverModel } from '#drivers/types/driver.types.js';
import { ModelBase, modelBaseKeys, sensitiveKeys } from '#types/common.types.js';
import { OmitType, PartialType } from '@nestjs/swagger';

const omitKeys = [...modelBaseKeys, ...sensitiveKeys] as (keyof DriverEntity)[];
export class DriverPatchDTO extends PartialType(OmitType(DriverEntity, omitKeys)) {}
export interface DriverUpdateDTO extends Partial<Omit<DriverModel, keyof ModelBase>> {}

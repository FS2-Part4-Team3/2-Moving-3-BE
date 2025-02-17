import { FilteredDriverOutputDTO } from '#auth/types/filtered.driver.dto.js';
import { DriverEntity, IDriver } from '#drivers/types/driver.types.js';
import { ModelBase, modelBaseKeys, sensitiveKeys } from '#types/common.types.js';
import { ApiProperty, OmitType, PartialType } from '@nestjs/swagger';

export class DriversListDTO {
  @ApiProperty({ description: '기사 인원 수' })
  totalCount: number;

  @ApiProperty({ description: '기사 목록', type: [FilteredDriverOutputDTO] })
  list: FilteredDriverOutputDTO[];
}

export class DriverIdDTO {
  @ApiProperty({ description: '기사 ID' })
  id: string[];
}

const omitKeys = [...modelBaseKeys, ...sensitiveKeys] as (keyof DriverEntity)[];
export class DriverPatchDTO extends PartialType(OmitType(DriverEntity, omitKeys)) {}
export interface DriverUpdateDTO extends Partial<Omit<IDriver, keyof ModelBase>> {}

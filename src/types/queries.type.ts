import { FindOptions } from '#types/options.type.js';
import { ApiProperty, PartialType } from '@nestjs/swagger';
import { Area, ServiceType } from '@prisma/client';
import { IsEnum, IsOptional } from 'class-validator';

export class GetQueries extends PartialType(FindOptions) {}

export class DriversGetQueries extends GetQueries {
  @IsOptional()
  @IsEnum(Area, { message: '올바른 지역을 골라주세요.' })
  @ApiProperty({ description: '이용 지역' })
  area: Area;

  @IsOptional()
  @IsEnum(ServiceType, { message: '올바른 서비스 타입을 골라주세요.' })
  @ApiProperty({ description: '서비스 타입' })
  serviceType: ServiceType;
}

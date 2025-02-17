import { PersonalInfo } from '#auth/types/filtered.types.js';
import { AreaType, ModelBase, ServiceType } from '#types/common.types.js';
import { ApiProperty } from '@nestjs/swagger';
import { $Enums } from '@prisma/client';
import { ArrayNotEmpty, IsIn } from 'class-validator';

export interface IUser extends ModelBase {
  email: string;
  name: string;
  phoneNumber?: string;
  image?: string;
  password?: string;
  salt?: string;
  refreshToken?: string;
  serviceType?: ServiceType[];
  areas?: AreaType[];

  provider?: string;
  providerId?: string;
}

export class UserEntity extends PersonalInfo {
  @ArrayNotEmpty({ message: '하나 이상의 지역을 선택해주세요' })
  @IsIn(Object.values($Enums.Area), { each: true, message: '올바른 지역을 선택해주세요.' })
  @ApiProperty({ description: '이용 지역' })
  areas: $Enums.Area[];

  @ArrayNotEmpty({ message: '하나 이상의 타입을 선택해주세요' })
  @IsIn(Object.values($Enums.ServiceType), { each: true, message: '올바른 지역을 선택해주세요.' })
  @ApiProperty({ description: '서비스 타입' })
  serviceType: $Enums.ServiceType[];
}

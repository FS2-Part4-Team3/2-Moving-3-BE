import { PersonalInfo } from '#auth/types/filtered.types.js';
import { Review } from '#reviews/types/review.types.js';
import { AreaType, ModelBase, ServiceType } from '#types/common.types.js';
import { $Enums } from '@prisma/client';
import { ArrayNotEmpty, IsDate, IsIn, IsNotEmpty, IsString } from 'class-validator';

export interface IDriver extends ModelBase {
  email: string;
  name: string;
  nickname?: string;
  image?: string;
  password?: string;
  salt?: string;
  refreshToken?: string;
  phoneNumber?: string;
  introduce?: string;
  description?: string;
  serviceType?: ServiceType[];
  availableAreas?: AreaType[];
  startAt: Date;

  applyCount: number;
  likeCount: number;
  rating: number;

  provider?: string;
  providerId?: string;

  reviews?: Review[];
}

export class DriverEntity extends PersonalInfo {
  @IsString({ message: '별명은 문자열 형식입니다.' })
  @IsNotEmpty({ message: '별명은 1글자 이상이어야 합니다.' })
  nickname: string;

  @IsString({ message: '자기소개는 문자열 형식입니다.' })
  @IsNotEmpty({ message: '자기소개는 1글자 이상이어야 합니다.' })
  introduce: string;

  @IsString({ message: '상세 정보는 문자열 형식입니다.' })
  @IsNotEmpty({ message: '상세 정보는 1글자 이상이어야 합니다.' })
  description: string;

  @ArrayNotEmpty({ message: '하나 이상의 지역을 선택해주세요' })
  @IsIn(Object.values($Enums.Area), { each: true })
  availableAreas: $Enums.Area[];

  @ArrayNotEmpty({ message: '하나 이상의 타입을 선택해주세요' })
  @IsIn(Object.values($Enums.ServiceType), { each: true })
  serviceType: $Enums.ServiceType[];

  @IsDate({ message: '올바르지 않은 날짜입니다.' })
  startAt: Date;
}

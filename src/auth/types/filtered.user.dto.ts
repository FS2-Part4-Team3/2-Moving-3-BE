import { PersonalInfo } from '#auth/types/filtered.types.js';
import { ProviderInfo } from '#auth/types/provider.types.js';
import { UserType } from '#types/common.types.js';
import { ApiProperty } from '@nestjs/swagger';
import { Area, ServiceType } from '@prisma/client';

export class FilteredUserOutputDTO extends PersonalInfo implements ProviderInfo {
  @ApiProperty({ description: '서비스 타입' })
  serviceType: ServiceType[];

  @ApiProperty({ description: '이용 지역' })
  areas: Area[];

  @ApiProperty({ description: '유저 타입' })
  type: UserType.User;

  @ApiProperty({ description: '소셜 로그인 프로바이더' })
  provider: string;

  @ApiProperty({ description: '프로바이더 아이디' })
  providerId: string;

  @ApiProperty({ description: '이미지 업로드 URL' })
  uploadUrl?: string;
}

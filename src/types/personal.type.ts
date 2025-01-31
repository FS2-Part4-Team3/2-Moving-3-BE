import { SignUpDTO } from '#auth/types/sign.dto.js';
import { ApiProperty } from '@nestjs/swagger';
import { IsJWT, IsOptional, Matches } from 'class-validator';

export const imageRegex = /(.*?)\.(jpg|jpeg|png|gif|bmp)$/;

export class PersonalInfo extends SignUpDTO {
  @IsOptional()
  @Matches(imageRegex, { message: '올바른 이미지 형식을 입력해주세요.' })
  @ApiProperty({ description: '프로필 사진' })
  image: string;

  @IsOptional()
  @IsJWT({ message: 'refreshToken은 JWT 형식이어야 합니다.' })
  refreshToken: string;
}

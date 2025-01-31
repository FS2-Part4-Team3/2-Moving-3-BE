import { passwordRegex } from '#auth/types/auth.types.js';
import ExceptionMessages from '#exceptions/exception.messages.js';
import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, Matches } from 'class-validator';

export class UpdatePasswordDTO {
  @ApiProperty({ description: '기존 비밀번호' })
  @Matches(passwordRegex, { message: `oldPw: ${ExceptionMessages.INVALID_PASSWORD_TYPE}` })
  oldPw: string;

  @IsOptional()
  @IsString()
  oldSalt?: string;

  @ApiProperty({ description: '새 비밀번호' })
  @IsString()
  newPw: string;

  @IsOptional()
  @IsString()
  newSalt?: string;
}

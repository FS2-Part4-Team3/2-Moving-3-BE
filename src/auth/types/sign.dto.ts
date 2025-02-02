import { phoneNumberRegex } from '#auth/types/auth.types.js';
import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsOptional, IsString, Matches } from 'class-validator';

export class SignInDTO {
  @ApiProperty({ description: '이메일' })
  @IsEmail({}, { message: '이메일 형식 입력이 필요합니다.' })
  email: string;

  @ApiProperty({ description: '비밀번호' })
  @IsString()
  password: string;
}

export class SignUpDTO extends SignInDTO {
  @ApiProperty({ description: '이름' })
  @IsString({ message: '이름은 문자열 형식입니다.' })
  @IsNotEmpty({ message: '이름은 1글자 이상이어야 합니다.' })
  name: string;

  @IsOptional()
  @IsString()
  salt?: string;

  @ApiProperty({ description: '전화번호' })
  @Matches(phoneNumberRegex, { message: '올바른 휴대전화 번호를 입력해주세요.' })
  phoneNumber: string;
}

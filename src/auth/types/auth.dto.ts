import { ApiProperty } from '@nestjs/swagger';

export class LoggedInUsersDTO {
  @ApiProperty({ description: '대상 ID' })
  id: string;

  @ApiProperty({ description: '온라인 여부' })
  isOnline: boolean;
}

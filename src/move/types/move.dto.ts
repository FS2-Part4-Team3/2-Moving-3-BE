import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsDate, IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { Progress, ProgressEnum, ServiceType, ServiceTypeEnum } from '#types/common.types.js';

export class MoveInfoIdDTO {
  @ApiProperty({ description: '이사정보 ID', type: String })
  id: string;
}

export class MoveInputDTO {
  @IsEnum(ServiceTypeEnum, { message: '서비스 타입이 유효하지 않습니다.' })
  @IsNotEmpty({ message: '서비스 타입을 선택해주세요.' })
  @ApiProperty({ description: '서비스 타입' })
  serviceType: ServiceType;

  @IsDate({ message: '유효한 날짜를 입력해주세요.' })
  @IsNotEmpty({ message: '이사 날짜는 필수입니다.' })
  @ApiProperty({ description: '이사 날짜' })
  date: Date;

  @IsString({ message: '출발 주소는 문자열이어야 합니다.' })
  @IsNotEmpty({ message: '출발 주소는 필수입니다.' })
  @ApiProperty({ description: '출발 주소' })
  fromAddress: string;

  @IsString({ message: '도착 주소는 문자열이어야 합니다.' })
  @IsNotEmpty({ message: '도착 주소는 필수입니다.' })
  @ApiProperty({ description: '도착 주소' })
  toAddress: string;
}

export class MovePatchInputDTO extends PartialType(MoveInputDTO) {}

export class CreateMoveDTO extends MoveInputDTO {
  @IsString({ message: '작성자 ID는 문자열이어야 합니다.' })
  @IsNotEmpty({ message: '작성자 ID는 필수입니다.' })
  @ApiProperty({ description: '작성자 ID' })
  ownerId: string;

  @IsEnum(ProgressEnum, { message: '이사정보 상태가 유효하지 않습니다.' })
  @IsNotEmpty({ message: '이사정보 상태는 필수입니다.' })
  @ApiProperty({ description: '이사정보 상태' })
  progress: Progress;
}

export class BaseMoveInfoOutputDTO {
  @ApiProperty({ description: '이사정보 ID', type: String })
  id: string;

  @ApiProperty({ description: '작성 날짜', type: String, format: 'date-time' })
  createdAt: Date;

  @ApiProperty({ description: '수정 날짜', type: String, format: 'date-time' })
  updatedAt: Date;

  @ApiProperty({ description: '삭제된 날짜', type: String, format: 'date-time' })
  deletedAt: Date;

  @ApiProperty({ description: '이사 유형', type: String })
  serviceType: ServiceType;

  @ApiProperty({ description: '이사 날짜', type: String, format: 'date-time' })
  date: Date;

  @ApiProperty({ description: '출발지', type: String })
  fromAddress: string;

  @ApiProperty({ description: '도착지', type: String })
  toAddress: string;

  @ApiProperty({ description: '이사정보 상태', type: String })
  progress: Progress;

  @ApiProperty({ description: '확정 견적 ID', type: String })
  confirmedEstimationId: string;

  @ApiProperty({ description: '작성자 ID', type: String })
  ownerId: string;
}

class OwnerNameDTO {
  @ApiProperty({ description: '작성자 이름', type: String })
  name: String;
}

class serviceTypeCountsDTO {
  @ApiProperty({ description: '타입(SMALL, HOME, OFFICE)', type: String })
  type: string;

  @ApiProperty({ description: '해당 타입 개수', type: Number })
  count: Number;
}

export class filterCountDTO {
  @ApiProperty({ description: '서비스타입 개수', type: [serviceTypeCountsDTO] })
  serviceTypeCounts: serviceTypeCountsDTO[];

  @ApiProperty({ description: '서비스가능지역 개수', type: Number })
  serviceAreaCount: Number;

  @ApiProperty({ description: '지정견적요청 개수', type: Number })
  designatedRequestCount: Number;
}

class MoveInfoRequestsDTO {
  @ApiProperty({ description: '지정견적요청 기사 ID', type: String })
  driverId: string;
}

class MoveInfoOutputDTO extends BaseMoveInfoOutputDTO {
  @ApiProperty({ description: '작성자', type: OwnerNameDTO })
  owner: OwnerNameDTO;

  @ApiProperty({ description: '이사정보의 지정견적요청', type: [MoveInfoRequestsDTO] })
  requests: MoveInfoRequestsDTO[];

  @ApiProperty({ description: '이사정보에 대한 지정견적요청 여부', type: Boolean })
  isSpecificRequest: boolean;
}

export class MoveInfoResponseDTO {
  @ApiProperty({ description: '전체 이사정보 개수', type: Number })
  totalCount: number;

  @ApiProperty({ description: '필터 개수', type: filterCountDTO })
  counts: filterCountDTO;

  @ApiProperty({ description: '이사 정보 목록', type: [MoveInfoOutputDTO] })
  list: MoveInfoOutputDTO[];
}

class DriverDTO {
  @ApiProperty({ description: '드라이버 ID', type: String })
  id: string;

  @ApiProperty({ description: '드라이버 이름', type: String })
  name: string;

  @ApiProperty({ description: '드라이버 프로필이미지', type: String })
  image: string;

  @ApiProperty({ description: '확정 회수', type: Number })
  applyCount: number;

  @ApiProperty({ description: '찜하기 회수', type: Number })
  likeCount: number;

  @ApiProperty({ description: '기사 점수', type: Number })
  rating: number;

  @ApiProperty({ description: '리뷰 개수', type: Number })
  reviewCount: number;

  @ApiProperty({ description: '경력 년수', type: Number })
  career: number;

  @ApiProperty({ description: '기사 찜하기 여부', type: Boolean })
  isliked: Boolean;
}

class EstimationDTO {
  @ApiProperty({ description: '견적 ID', type: String })
  id: string;

  @ApiProperty({ description: '작성 날짜', type: String, format: 'date-time' })
  createdAt: Date;

  @ApiProperty({ description: '수정 날짜', type: String, format: 'date-time' })
  updatedAt: Date;

  @ApiProperty({ description: '삭제된 날짜', type: String, format: 'date-time' })
  deletedAt: Date;

  @ApiProperty({ description: '견적 가격', type: Number })
  price: number;

  @ApiProperty({ description: '견적 코멘트', type: String })
  comment: string;

  @ApiProperty({ description: '이사 정보 ID', type: String })
  moveInfoId: string;

  @ApiProperty({ description: '드라이버 ID', type: String })
  driverId: string;

  @ApiProperty({ description: '드라이버 정보', type: DriverDTO })
  driver: DriverDTO;

  @ApiProperty({ description: '지정견적요청 여부', type: Boolean })
  isSpecificRequest: Boolean;
}

export class MoveInfoWithEstimationsDTO extends BaseMoveInfoOutputDTO {
  @ApiProperty({ description: '확정된 견적', type: EstimationDTO })
  confirmedEstimation: EstimationDTO;

  @ApiProperty({ description: '이사정보의 견적들', type: [EstimationDTO] })
  estimations: EstimationDTO[];
}

export class MoveInfoWithEstimationsResponseDTO {
  @ApiProperty({ description: '전체 이사정보 개수', type: Number })
  totalCount: number;

  @ApiProperty({ description: '이사 정보 목록', type: [MoveInfoWithEstimationsDTO] })
  list: MoveInfoWithEstimationsDTO[];
}

export class IsMoveInfoEditableDTO {
  @ApiProperty({ description: '이사정보 변경 가능여부', type: Boolean })
  isMoveInfoEditable: Boolean;
}

export class IsMoveInfoRegistrableDTO {
  @ApiProperty({ description: '이사정보 등록 가능여부', type: Boolean })
  isMoveInfoRegistrable: Boolean;
}

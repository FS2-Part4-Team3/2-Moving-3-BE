import { Area } from '@prisma/client';

export function areaToKeyword(area: Area): string {
  switch (area) {
    case 'SEOUL':
      return '서울';
    case 'GYEONGGI':
      return '경기';
    case 'INCHEON':
      return '인천';
    case 'GAGNWON':
      return '강원';
    case 'CHUNGBUK':
      return '충북';
    case 'CHUNGNAM':
      return '충남';
    case 'SEJONG':
      return '세종';
    case 'DAEJEON':
      return '대전';
    case 'JEONBUK':
      return '전북';
    case 'JEONNAM':
      return '전남';
    case 'GWANGJU':
      return '광주';
    case 'GYEONGBUK':
      return '경북';
    case 'GYEONGNAM':
      return '경남';
    case 'DAEGU':
      return '대구';
    case 'ULSAN':
      return '울산';
    case 'BUSAN':
      return '부산';
    case 'JEJU':
      return '제주';
    default:
      return '';
  }
}

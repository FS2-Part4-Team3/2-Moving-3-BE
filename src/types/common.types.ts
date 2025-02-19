export interface IStorage {
  [key: string]: any;
}

export class ModelBase {
  id?: string;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;
}

export const modelBaseKeys = Object.keys(new ModelBase());

export enum UserType {
  User = 'user',
  Driver = 'driver',
}

export class SensitiveData {
  password: string;
  salt: string;
  refreshToken: string;
}

export const sensitiveKeys = Object.keys(new SensitiveData());

export type ServiceType = 'SMALL' | 'HOME' | 'OFFICE';

export enum ServiceTypeEnum {
  SMALL = 'SMALL',
  HOME = 'HOME',
  OFFICE = 'OFFICE',
}

export type Status = 'PENDING' | 'EXPIRED' | 'APPLY' | 'REJECTED' | 'CANCELED';

export enum StatusEnum {
  PENDING = 'PENDING',
  EXPIRED = 'EXPIRED',
  APPLY = 'APPLY',
  REJECTED = 'REJECTED',
  CANCELED = 'CANCELED',
}

export type Progress = 'PENDING' | 'OPEN' | 'EXPIRED' | 'CONFIRMED' | 'CANCELED' | 'COMPLETE';

export enum ProgressEnum {
  PENDING = 'PENDING',
  OPEN = 'OPEN',
  EXPIRED = 'EXPIRED',
  CONFIRMED = 'CONFIRMED',
  CANCELED = 'CANCELED',
  COMPLETE = 'COMPLETE',
}

export type AreaType =
  | 'SEOUL'
  | 'GYEONGGI'
  | 'INCHEON'
  | 'GANGWON'
  | 'CHUNGBUK'
  | 'CHUNGNAM'
  | 'SEJONG'
  | 'DAEJEON'
  | 'JEONBUK'
  | 'JEONNAM'
  | 'GWANGJU'
  | 'GYEONGBUK'
  | 'GYEONGNAM'
  | 'DAEGU'
  | 'ULSAN'
  | 'BUSAN'
  | 'JEJU';

export enum AreaTypeEnum {
  SEOUL = 'SEOUL',
  GYEONGGI = 'GYEONGGI',
  INCHEON = 'INCHEON',
  GANGWON = 'GANGWON',
  CHUNGBUK = 'CHUNGBUK',
  CHUNGNAM = 'CHUNGNAM',
  SEJONG = 'SEJONG',
  DAEJEON = 'DAEJEON',
  JEONBUK = 'JEONBUK',
  JEONNAM = 'JEONNAM',
  GWANGJU = 'GWANGJU',
  GYEONGBUK = 'GYEONGBUK',
  GYEONGNAM = 'GYEONGNAM',
  DAEGU = 'DAEGU',
  ULSAN = 'ULSAN',
  BUSAN = 'BUSAN',
  JEJU = 'JEJU',
}

export type KeywordType = 'POSITIVE' | 'NEGATIVE';

export enum KeywordTypeEnum {
  POSITIVE = 'POSITIVE',
  NEGATIVE = 'NEGATIVE',
}

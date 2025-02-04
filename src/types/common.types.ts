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

export type NotificationType =
  | 'MOVE_INFO_EXPIRED'
  | 'NEW_REQUEST'
  | 'NEW_ESTIMATION'
  | 'REQUEST_REJECTED'
  | 'ESTIMATION_CONFIRMED'
  | 'NEW_QUESTION'
  | 'D_7'
  | 'D_1'
  | 'D_DAY';

export enum NotificationTypeEnum {
  MOVE_INFO_EXPIRED = 'MOVE_INFO_EXPIRED',
  NEW_REQUEST = 'NEW_REQUEST',
  NEW_ESTIMATION = 'NEW_ESTIMATION',
  REQUEST_REJECTED = 'REQUEST_REJECTED',
  ESTIMATION_CONFIRMED = 'ESTIMATION_CONFIRMED',
  NEW_QUESTION = 'NEW_QUESTION',
  D_7 = 'D_7',
  D_1 = 'D_1',
  D_DAY = 'D_DAY',
}

export type AreaType =
  | 'SEOUL'
  | 'GYEONGGI'
  | 'INCHEON'
  | 'GAGNWON'
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
  GAGNWON = 'GAGNWON',
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

export type MoveInfoType = {};
export interface IMoveInfo {
  id: string;
  createdAt: Date;
  updatedAt: Date;

  serviceType: ServiceType;
  date: Date;
  fromAddress: string;
  toAddress: string;
  progress: Progress;

  confirmedEstimationId: string;

  ownerId: string;
  estimations: IEstimation[];
  requests: IRequest[];
}

enum ServiceType {
  SMALL = 'SMALL',
  HOME = 'HOME',
  OFFICE = 'OFFICE',
}

export enum Progress {
  PENDING = 'PENDING',
  OPEN = 'OPEN',
  EXPIRED = 'EXPIRED',
  CONFIRMED = 'CONFIRMED',
  CANCELED = 'CANCELED',
  COMPLETE = 'COMPLETE',
}

export interface IEstimation {
  id: string;
  createdAt: Date;
  updatedAt: Date;

  price: number;
  comment: string;

  moveInfoId: string;
  driverId: string;

  confirmedForId: string;
}

export interface IRequest {
  id: string;
  createdAt: Date;
  updatedAt: Date;

  moveInfoId: string;
  status: RequestStatus;
  driverId: string;
  driverNotifications: any[];
}

export enum RequestStatus {
  PENDING = 'PENDING',
  EXPIRED = 'EXPIRED',
  APPLY = 'APPLY',
  REJECTED = 'REJECTED',
  CANCELED = 'CANCELED',
}

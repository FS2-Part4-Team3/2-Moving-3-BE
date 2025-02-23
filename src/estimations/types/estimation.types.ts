import { IMoveInfo, MoveInfo } from '#move/types/move.types.js';
import { ModelBase } from '#types/common.types.js';
import { Estimation as PrismaEstimation, Request } from '@prisma/client';
import { IsActivate } from '#types/options.type.js';
import { Driver } from '@prisma/client';
import { IDriver } from '#drivers/types/driver.types.js';
import { IRequest } from '#requests/types/request.types.js';

interface PrismaEstimationBase extends Omit<PrismaEstimation, keyof ModelBase> {}
interface EstimationBase extends PrismaEstimationBase {}

export interface Estimation extends EstimationBase, ModelBase {
  driver?: Driver;
  moveInfo?: MoveInfo;
  request?: Request;
  designatedRequest?: IsActivate;
}

export interface EstimationInputDTO extends Omit<Estimation, keyof ModelBase> {}

export interface IEstimation {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;

  price?: number;
  comment: string;

  moveInfoId: string;
  moveInfo: IMoveInfo;

  driverId: string;
  driver: IDriver;

  confirmedForId?: string;
  confirmedFor?: IMoveInfo;

  request?: IRequest;
  designatedRequest?: IsActivate;
}

export class EstimationDTO {
  moveInfoId: string;
  driverId: string;
  comment: string;
  price: number | null;
}

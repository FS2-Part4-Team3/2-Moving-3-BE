import { IEstimation } from '#estimations/estimation.types.js';
import { IRequest } from '#requests/types/request.types.js';
import { ModelBase, Progress, ServiceType } from '#types/common.types.js';
import { MoveInfo as PrismaMoveInfo } from '@prisma/client';

interface PrismaMoveInfoBase extends Omit<PrismaMoveInfo, keyof ModelBase> {}
interface MoveInfoBase extends PrismaMoveInfoBase {}

export interface MoveInfo extends MoveInfoBase, ModelBase {}

export interface MoveInfoInputDTO extends Omit<MoveInfo, keyof ModelBase> {}

export interface IMoveInfo {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;

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

export interface UpdateResponse {
  count: number;
  success: boolean;
}

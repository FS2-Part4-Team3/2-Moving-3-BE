import { CreateMoveDTO, filterCountDTO, MoveInfoWithEstimationsDTO, MovePatchInputDTO } from '#move/types/move.dto.js';
import { IMoveInfo } from '#move/types/move.types.js';
import { OffsetPaginationOptions } from '#types/options.type.js';
import { MoveInfoGetQueries } from '#types/queries.type.js';
import { Area } from '@prisma/client';

export interface IMoveRepository {
  findManyByDate: (date: Date) => Promise<IMoveInfo[]>;
  findMany: (options: MoveInfoGetQueries, driverId: string, whereCondition: any) => Promise<IMoveInfo[]>;
  getTotalCount: (whereCondition: any, isForceFind: boolean) => Promise<number>;
  getFilteringCounts: (driverId: string, driverAvailableAreas: Area[]) => Promise<filterCountDTO>;
  findByUserId: (userId: string) => Promise<IMoveInfo[]>;
  findWithEstimationsByUserId: (
    userId: string,
    paginationOptions: OffsetPaginationOptions,
  ) => Promise<MoveInfoWithEstimationsDTO[]>;
  findByMoveInfoId: (moveInfoId: string) => Promise<IMoveInfo>;
  postMoveInfo: (moveData: CreateMoveDTO) => Promise<IMoveInfo>;
  update: (id: string, data: MovePatchInputDTO) => Promise<IMoveInfo>;
  softDeleteMoveInfo: (id: string) => Promise<IMoveInfo>;
}

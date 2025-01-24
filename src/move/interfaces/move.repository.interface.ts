import { filterCountDTO, MoveInfo, MoveInfoInputDTO } from '#move/move.types.js';
import { IMoveInfo } from '#move/types/move.types.js';
import { MoveInfoGetQueries } from '#types/queries.type.js';
import { Area } from '@prisma/client';

export interface IMoveRepository {
  findMany: (options: MoveInfoGetQueries, driverId: string, driverAvailableAreas: Area[]) => Promise<MoveInfo[]>;
  getTotalCount: (options: MoveInfoGetQueries, driverId: string, driverAvailableAreas: Area[]) => Promise<number>;
  getFilteringCounts: (driverId: string, driverAvailableAreas: Area[]) => Promise<filterCountDTO>;
  findByUserId: (userId: string) => Promise<MoveInfo[]>;
  findByMoveInfoId: (moveInfoId: string) => Promise<IMoveInfo>;
  postMoveInfo: (moveData: MoveInfoInputDTO) => Promise<MoveInfo>;
  update: (id: string, data: Partial<MoveInfoInputDTO>) => Promise<MoveInfo>;
  delete: (id: string) => void;
}

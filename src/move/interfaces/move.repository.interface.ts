import { MoveInfo, MoveInfoInputDTO } from '#move/move.types.js';
import { MoveInfoGetQueries } from '#types/queries.type.js';
import { Area } from '@prisma/client';

export interface IMoveRepository {
  findMany: (
    options: MoveInfoGetQueries,
    driverId: string,
    driverAvailableAreas: Area[],
  ) => Promise<{ totalCount: number; list: MoveInfo[] }>;
  findByUserId: (userId: string) => Promise<MoveInfo[]>;
  findByMoveInfoId: (moveInfoId: string) => Promise<MoveInfo> | null;
  create: (data: MoveInfoInputDTO) => void;
  update: (id: string, data: Partial<MoveInfoInputDTO>) => void;
  delete: (id: string) => void;
}

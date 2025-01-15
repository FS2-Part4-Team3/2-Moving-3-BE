import { MoveInfo, MoveInfoInputDTO } from '#move/move.types.js';
import { FindOptions, RequestFilter } from '#types/options.type.js';
import { Area } from '@prisma/client';

export interface IMoveRepository {
  findMany: (
    options: FindOptions & RequestFilter,
    driverId: string,
    driverAvailableAreas: Area[],
  ) => Promise<{ totalCount: number; list: MoveInfo[] }>;
  findByUserId: (userId: string) => Promise<MoveInfo[]>;
  findByMoveInfoId: (userId: string) => Promise<MoveInfo> | null;
  createMoveInfo: (moveData: MoveInfoInputDTO) => Promise<MoveInfo>; 
  update: (id: string, data: Partial<MoveInfoInputDTO>) => void;
  delete: (id: string) => void;
}

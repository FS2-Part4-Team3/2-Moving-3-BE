import { MoveInfo, MoveInfoInputDTO } from '#move/move.types.js';
import { FindOptions } from '#types/options.type.js';

export interface IMoveRepository {
  findMany: (options: FindOptions) => void;
  findById: (userId: string) => Promise<MoveInfo>;
  create: (data: MoveInfoInputDTO) => void;
  update: (id: string, data: Partial<MoveInfoInputDTO>) => void;
  delete: (id: string) => void;
}

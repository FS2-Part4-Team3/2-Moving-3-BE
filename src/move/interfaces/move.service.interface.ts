import { MoveInfo } from '#move/move.types.js';

export interface IMoveService {
  getMoveInfo: () => Promise<MoveInfo>;
}

import { MoveInfo } from '#move/move.types.js';

export interface IMoveController {
  getMoveInfo: () => Promise<MoveInfo>;
}

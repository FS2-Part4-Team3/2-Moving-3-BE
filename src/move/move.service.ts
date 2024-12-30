import { IMoveService } from '#move/interfaces/move.service.interface.js';
import { Injectable } from '@nestjs/common';

@Injectable()
export class MoveService implements IMoveService {
  constructor() {}
}

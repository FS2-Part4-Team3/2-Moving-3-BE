import { IEstimationService } from '#estimations/interfaces/estimation.service.interface.js';
import { Injectable } from '@nestjs/common';

@Injectable()
export class EstimationService implements IEstimationService {
  constructor() {}
}

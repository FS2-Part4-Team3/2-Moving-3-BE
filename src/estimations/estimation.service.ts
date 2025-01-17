import { IEstimationService } from '#estimations/interfaces/estimation.service.interface.js';
import { EstimationRepository } from '#estimations/estimation.repository.js';
import { EstimationInputDTO, Estimation } from '#estimations/estimation.types.js';
import { Injectable } from '@nestjs/common';

@Injectable()
export class EstimationService implements IEstimationService {
  constructor(private readonly estimationRepository: EstimationRepository) {}

  async createEstimation(moveInfoId: string, data: EstimationInputDTO): Promise<Estimation> {
    return this.estimationRepository.create({ ...data, moveInfoId });
  }
}

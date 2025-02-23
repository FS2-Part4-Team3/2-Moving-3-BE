import { EstimationInputDTO, EstimationOutputDTO } from '#estimations/types/estimation.dto.js';
import { FindOptions, IsActivate } from '#types/options.type.js';
import { Estimation, EstimationDTO } from '#estimations/types/estimation.types.js';

export interface IEstimationRepository {
  findMany: (options: FindOptions) => void;
  findById: (id: string) => Promise<Estimation> | null;
  create: (data: EstimationDTO) => Promise<Estimation>;
  findTotalCount: (moveInfoIds: string[]) => Promise<number>;
  findReviewableEstimations: (userId: string, moveInfoIds: string[], page: number, pageSize: number) => Promise<Estimation[]>;
  isDesignatedRequest: (estimationId: string) => Promise<IsActivate>;
  isDesignatedRequestDriver: (estimationId: string) => Promise<IsActivate>;
  countByDriverId: (driverId: string) => Promise<number>;
  findEstimationByMoveInfo: (moveInfoId: string, estimationId: string) => Promise<Estimation | null>;
  confirmedForIdEstimation: (estimationId: string, moveInfoId: string) => Promise<Estimation>;
  findEstimationsByDriverId: (driverId: string, page: number, pageSize: number) => Promise<Estimation[]>;
  countEstimationsByDriverId: (driverId: string) => Promise<number>;
  isDesignatedRequestForDriver: (estimationId: string, driverId: string) => Promise<IsActivate>;
  findEstimationDetail: (estimationId: string) => Promise<EstimationOutputDTO | null>;
  findEstimationDriverDetail: (estimationId: string) => Promise<Estimation | null>;
  findRejectedEstimationsByDriverId: (driverId: string, page: number, pageSize: number) => Promise<Estimation[]>;
  countRejectedEstimationsByDriverId: (driverId: string) => Promise<number>;
  getTotalCountForUser: (userId: string) => Promise<number>;
  isDesignatedEstimation: (estimationId: string) => Promise<boolean>;
  findUserEstimations: (userId: string, page: number, pageSize: number) => Promise<Estimation[]>;
  findUserEstimation: (
    userId: string,
    page: number,
    pageSize: number,
  ) => Promise<{ estimations: Estimation[]; totalCount: number }>;
  findByMoveInfoId: (moveInfoId: string) => Promise<Estimation[]>;
}

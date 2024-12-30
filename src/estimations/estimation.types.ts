import { ModelBase } from '#types/common.types.js';
import { Estimation as PrismaEstimation } from '@prisma/client';

interface PrismaEstimationBase extends Omit<PrismaEstimation, keyof ModelBase> {}
interface EstimationBase extends PrismaEstimationBase {}

export interface Estimation extends EstimationBase, ModelBase {}

export interface EstimationInputDTO extends Omit<Estimation, keyof ModelBase> {}

import { ModelBase } from '#types/common.types.js';
import { Review as PrismaReview } from '@prisma/client';

interface PrismaReviewBase extends Omit<PrismaReview, keyof ModelBase> {}
interface ReviewBase extends PrismaReviewBase {}

export interface Review extends ReviewBase, ModelBase {}

export interface ReviewInputDTO extends Omit<Review, keyof ModelBase> {}

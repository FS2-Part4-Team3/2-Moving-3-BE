import { ModelBase } from '#types/common.types.js';
import { Request as PrismaRequest } from '@prisma/client';

interface PrismaRequestBase extends Omit<PrismaRequest, keyof ModelBase> {}
interface RequestBase extends PrismaRequestBase {}

export interface Request extends RequestBase, ModelBase {}

export interface RequestInputDTO extends Omit<Request, keyof ModelBase> {}

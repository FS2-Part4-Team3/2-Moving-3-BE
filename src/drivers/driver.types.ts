import { ModelBase } from '#types/common.types.js';
import { Driver as PrismaDriver } from '@prisma/client';

interface PrismaDriverBase extends Omit<PrismaDriver, keyof ModelBase> {}
interface DriverBase extends PrismaDriverBase {}

export interface Driver extends DriverBase, ModelBase {}

export interface DriverInputDTO extends Omit<Driver, keyof ModelBase> {}

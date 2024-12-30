import { ModelBase } from '#types/common.types.js';
import { User as PrismaUser } from '@prisma/client';

interface PrismaUserBase extends Omit<PrismaUser, keyof ModelBase> {}
interface UserBase extends PrismaUserBase {}

export interface User extends UserBase, ModelBase {}

export interface UserInputDTO extends Omit<User, keyof ModelBase> {}

import { ModelBase, Status } from '#types/common.types.js';
import { ApiProperty } from '@nestjs/swagger';
import { Request as PrismaRequest } from '@prisma/client';
import { IsNotEmpty, IsOptional, IsUUID } from 'class-validator';

interface PrismaRequestBase extends Omit<PrismaRequest, keyof ModelBase> {}
interface RequestBase extends PrismaRequestBase {}

export interface Request extends RequestBase, ModelBase {}

export interface RequestInputDTO extends Omit<Omit<Request, keyof ModelBase>, 'notificationId'> {}

export interface IRequest {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;

  moveInfoId: string;
  status: Status;

  driverId: string;
}

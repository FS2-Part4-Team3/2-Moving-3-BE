export interface IStorage {
  [key: string]: any;
}

export class ModelBase {
  id?: string;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;
}

export const modelBaseKeys = Object.keys(new ModelBase());

export enum UserType {
  User = 'user',
  Driver = 'driver',
}

export class SensitiveData {
  password: string;
  salt: string;
  refreshToken: string;
}

export const sensitiveKeys = Object.keys(new SensitiveData());

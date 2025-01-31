export interface IStorage {
  [key: string]: any;
}

export class ModelBase {
  id?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export enum UserType {
  User = 'user',
  Driver = 'driver',
}

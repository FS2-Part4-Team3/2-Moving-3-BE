export interface IStorage {
  [key: string]: any;
}

export interface ModelBase {
  id?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export enum UserType {
  User = 'user',
  Driver = 'driver',
}

import { SignUpDTO } from '#auth/auth.types.js';
import { Driver, DriverInputDTO } from '#drivers/driver.types.js';
import { FindOptions } from '#types/options.type.js';

export interface IDriverRepository {
  count: () => Promise<number>;
  findMany: (options: FindOptions) => void;
  findById: (id: string) => Promise<Driver> | null;
  findByEmail: (email: string) => Promise<Driver> | null;
  create: (data: SignUpDTO) => Promise<Driver>;
  update: (id: string, data: Partial<DriverInputDTO>) => void;
  delete: (id: string) => void;
  like: (driverId: string, userId: string) => Promise<Driver>;
  unlike: (driverId: string, userId: string) => Promise<Driver>;
}

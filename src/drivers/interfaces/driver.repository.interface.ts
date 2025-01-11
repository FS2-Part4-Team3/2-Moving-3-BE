import { SignUpDTO } from '#auth/auth.types.js';
import { Driver, DriverUpdateDTO } from '#drivers/driver.types.js';
import { FindOptions } from '#types/options.type.js';

export interface IDriverRepository {
  count: () => Promise<number>;
  findMany: (options: FindOptions) => Promise<Driver[]>;
  findById: (id: string) => Promise<Driver> | null;
  findByEmail: (email: string) => Promise<Driver> | null;
  create: (data: SignUpDTO) => Promise<Driver>;
  update: (id: string, data: DriverUpdateDTO) => Promise<Driver>;
  delete: (id: string) => void;
  like: (driverId: string, userId: string) => Promise<Driver>;
  unlike: (driverId: string, userId: string) => Promise<Driver>;
}

import { GoogleCreateDTO } from '#auth/types/provider.dto.js';
import { SignUpDTO } from '#auth/types/sign.dto.js';
import { Driver, DriverUpdateDTO } from '#drivers/driver.types.js';
import { DriversFindOptions } from '#types/options.type.js';

export interface IDriverRepository {
  count: (options: DriversFindOptions) => Promise<number>;
  findMany: (options: DriversFindOptions) => Promise<Driver[]>;
  findById: (id: string) => Promise<Driver> | null;
  findByEmail: (email: string) => Promise<Driver> | null;
  createBySignUp: (data: SignUpDTO) => Promise<Driver>;
  createByGoogleCreateDTO: (data: GoogleCreateDTO) => Promise<Driver>;
  update: (id: string, data: DriverUpdateDTO) => Promise<Driver>;
  delete: (id: string) => void;
  like: (driverId: string, userId: string) => Promise<Driver>;
  unlike: (driverId: string, userId: string) => Promise<Driver>;
}

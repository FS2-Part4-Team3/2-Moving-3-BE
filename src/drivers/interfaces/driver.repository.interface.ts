import { ProviderCreateDTO } from '#auth/types/provider.types.js';
import { SignUpDTO } from '#auth/types/sign.dto.js';
import { DriverUpdateDTO } from '#drivers/types/driver.dto.js';
import { DriverModel } from '#drivers/types/driver.types.js';
import { DriversFindOptions } from '#types/options.type.js';

export interface IDriverRepository {
  count: (options: DriversFindOptions) => Promise<number>;
  findMany: (options: DriversFindOptions) => Promise<DriverModel[]>;
  findById: (id: string) => Promise<DriverModel> | null;
  findByEmail: (email: string) => Promise<DriverModel> | null;
  createBySignUp: (data: SignUpDTO) => Promise<DriverModel>;
  createByProviderCreateDTO: (data: ProviderCreateDTO) => Promise<DriverModel>;
  update: (id: string, data: DriverUpdateDTO) => Promise<DriverModel>;
  delete: (id: string) => void;
  like: (driverId: string, userId: string) => Promise<DriverModel>;
  unlike: (driverId: string, userId: string) => Promise<DriverModel>;
}

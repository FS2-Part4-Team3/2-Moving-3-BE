import { ProviderCreateDTO } from '#auth/types/provider.types.js';
import { SignUpDTO } from '#auth/types/sign.dto.js';
import { DriverIdDTO, DriverUpdateDTO } from '#drivers/types/driver.dto.js';
import { IDriver } from '#drivers/types/driver.types.js';
import { DriversFindOptions } from '#types/options.type.js';

export interface IDriverRepository {
  count: (options: DriversFindOptions) => Promise<number>;
  findMany: (options: DriversFindOptions) => Promise<IDriver[]>;
  findById: (id: string) => Promise<IDriver> | null;
  findByEmail: (email: string) => Promise<IDriver> | null;
  createBySignUp: (data: SignUpDTO) => Promise<IDriver>;
  createByProviderCreateDTO: (data: ProviderCreateDTO) => Promise<IDriver>;
  update: (id: string, data: DriverUpdateDTO) => Promise<IDriver>;
  delete: (id: string) => void;
  like: (driverId: string, userId: string) => Promise<IDriver>;
  unlike: (driverId: string, userId: string) => Promise<IDriver>;
  findAllDriverIds: () => Promise<DriverIdDTO>;
}

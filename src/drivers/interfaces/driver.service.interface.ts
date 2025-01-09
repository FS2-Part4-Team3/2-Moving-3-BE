import { Driver } from '#drivers/driver.types.js';
import { FindOptions } from '#types/options.type.js';

export interface IDriverService {
  findDrivers: (options: FindOptions) => Promise<{ totalCount: number; list: Driver[] }>;
}

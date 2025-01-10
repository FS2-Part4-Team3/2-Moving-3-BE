import { Driver } from '#drivers/driver.types.js';
import { FindOptions } from '#types/options.type.js';
import { FilteredPersonalInfo } from '#types/personal.type.js';

export interface IDriverService {
  findDrivers: (options: FindOptions) => Promise<{ totalCount: number; list: Driver[] }>;
  findDriver: (id: string) => Promise<FilteredPersonalInfo<Driver>>;
}

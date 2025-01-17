import { Driver, DriverPatchDTO } from '#drivers/driver.types.js';
import { DriversFindOptions } from '#types/options.type.js';
import { FilteredPersonalInfo } from '#types/personal.type.js';

export interface IDriverService {
  findDrivers: (options: DriversFindOptions) => Promise<{ totalCount: number; list: FilteredPersonalInfo<Driver>[] }>;
  findDriver: (id: string) => Promise<FilteredPersonalInfo<Driver>>;
  updateDriver: (body: DriverPatchDTO) => Promise<FilteredPersonalInfo<Driver>>;
  findLikedDrivers: (options: DriversFindOptions) => Promise<{ totalCount: number; list: FilteredPersonalInfo<Driver>[] }>;
  likeDriver: (driverId: string) => Promise<FilteredPersonalInfo<Driver>>;
  unlikeDriver: (driverId: string) => Promise<FilteredPersonalInfo<Driver>>;
}

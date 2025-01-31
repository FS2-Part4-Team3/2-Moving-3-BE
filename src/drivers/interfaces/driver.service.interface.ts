import { FilteredPersonalInfo } from '#auth/types/filtered.types.js';
import { DriverPatchDTO } from '#drivers/types/driver.dto.js';
import { Driver } from '#drivers/types/driver.types.js';
import { DriversFindOptions } from '#types/options.type.js';

export interface IDriverService {
  findDrivers: (options: DriversFindOptions) => Promise<{ totalCount: number; list: FilteredPersonalInfo<Driver>[] }>;
  findDriver: (id: string) => Promise<FilteredPersonalInfo<Driver>>;
  updateDriver: (body: DriverPatchDTO) => Promise<FilteredPersonalInfo<Driver>>;
  findLikedDrivers: (options: DriversFindOptions) => Promise<{ totalCount: number; list: FilteredPersonalInfo<Driver>[] }>;
  likeDriver: (driverId: string) => Promise<FilteredPersonalInfo<Driver>>;
  unlikeDriver: (driverId: string) => Promise<FilteredPersonalInfo<Driver>>;
}

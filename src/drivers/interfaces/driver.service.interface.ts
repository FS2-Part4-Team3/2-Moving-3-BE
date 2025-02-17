import { FilteredPersonalInfo } from '#auth/types/filtered.types.js';
import { DriverPatchDTO } from '#drivers/types/driver.dto.js';
import { IDriver } from '#drivers/types/driver.types.js';
import { DriversFindOptions } from '#types/options.type.js';

export interface IDriverService {
  findDrivers: (options: DriversFindOptions) => Promise<{ totalCount: number; list: FilteredPersonalInfo<IDriver>[] }>;
  findDriver: (id: string) => Promise<FilteredPersonalInfo<IDriver>>;
  updateDriver: (body: DriverPatchDTO) => Promise<FilteredPersonalInfo<IDriver>>;
  findLikedDrivers: (options: DriversFindOptions) => Promise<{ totalCount: number; list: FilteredPersonalInfo<IDriver>[] }>;
  likeDriver: (driverId: string) => Promise<FilteredPersonalInfo<IDriver>>;
  unlikeDriver: (driverId: string) => Promise<FilteredPersonalInfo<IDriver>>;
}

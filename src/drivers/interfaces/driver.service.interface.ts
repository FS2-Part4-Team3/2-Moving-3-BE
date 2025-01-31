import { FilteredPersonalInfo } from '#auth/types/filtered.types.js';
import { DriverPatchDTO } from '#drivers/types/driver.dto.js';
import { DriverModel } from '#drivers/types/driver.types.js';
import { DriversFindOptions } from '#types/options.type.js';

export interface IDriverService {
  findDrivers: (options: DriversFindOptions) => Promise<{ totalCount: number; list: FilteredPersonalInfo<DriverModel>[] }>;
  findDriver: (id: string) => Promise<FilteredPersonalInfo<DriverModel>>;
  updateDriver: (body: DriverPatchDTO) => Promise<FilteredPersonalInfo<DriverModel>>;
  findLikedDrivers: (options: DriversFindOptions) => Promise<{ totalCount: number; list: FilteredPersonalInfo<DriverModel>[] }>;
  likeDriver: (driverId: string) => Promise<FilteredPersonalInfo<DriverModel>>;
  unlikeDriver: (driverId: string) => Promise<FilteredPersonalInfo<DriverModel>>;
}

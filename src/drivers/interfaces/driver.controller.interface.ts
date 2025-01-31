import { FilteredPersonalInfo } from '#auth/types/filtered.types.js';
import { DriverPatchDTO } from '#drivers/types/driver.dto.js';
import { Driver } from '#drivers/types/driver.types.js';
import { DriversGetQueries } from '#types/queries.type.js';

export interface IDriverController {
  getDrivers: (query: DriversGetQueries) => Promise<{ totalCount: number; list: FilteredPersonalInfo<Driver>[] }>;
  getDriver: (id: string) => Promise<FilteredPersonalInfo<Driver>>;
  patchDriver: (body: DriverPatchDTO) => Promise<FilteredPersonalInfo<Driver>>;
  getLikedDrivers: (page: number, pageSize: number) => void;
  postLikeDriver: (id: string) => Promise<FilteredPersonalInfo<Driver>>;
  deleteLikeDriver: (id: string) => Promise<FilteredPersonalInfo<Driver>>;
}

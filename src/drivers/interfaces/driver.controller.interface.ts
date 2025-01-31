import { FilteredPersonalInfo } from '#auth/types/filtered.types.js';
import { DriverPatchDTO } from '#drivers/types/driver.dto.js';
import { DriverModel } from '#drivers/types/driver.types.js';
import { DriversGetQueries } from '#types/queries.type.js';

export interface IDriverController {
  getDrivers: (query: DriversGetQueries) => Promise<{ totalCount: number; list: FilteredPersonalInfo<DriverModel>[] }>;
  getDriver: (id: string) => Promise<FilteredPersonalInfo<DriverModel>>;
  patchDriver: (body: DriverPatchDTO) => Promise<FilteredPersonalInfo<DriverModel>>;
  getLikedDrivers: (page: number, pageSize: number) => void;
  postLikeDriver: (id: string) => Promise<FilteredPersonalInfo<DriverModel>>;
  deleteLikeDriver: (id: string) => Promise<FilteredPersonalInfo<DriverModel>>;
}

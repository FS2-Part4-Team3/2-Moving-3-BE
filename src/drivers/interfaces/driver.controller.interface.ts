import { FilteredPersonalInfo } from '#auth/types/filtered.types.js';
import { DriverPatchDTO } from '#drivers/types/driver.dto.js';
import { IDriver } from '#drivers/types/driver.types.js';
import { DriversGetQueries } from '#types/queries.type.js';

export interface IDriverController {
  getDrivers: (query: DriversGetQueries) => Promise<{ totalCount: number; list: FilteredPersonalInfo<IDriver>[] }>;
  getDriver: (id: string) => Promise<FilteredPersonalInfo<IDriver>>;
  patchDriver: (body: DriverPatchDTO) => Promise<FilteredPersonalInfo<IDriver>>;
  getLikedDrivers: (page: number, pageSize: number) => void;
  postLikeDriver: (id: string) => Promise<FilteredPersonalInfo<IDriver>>;
  deleteLikeDriver: (id: string) => Promise<FilteredPersonalInfo<IDriver>>;
}

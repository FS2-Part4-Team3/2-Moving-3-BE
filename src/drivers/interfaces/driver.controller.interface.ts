import { Driver } from '#drivers/driver.types.js';
import { FilteredPersonalInfo } from '#types/personal.type.js';
import { DriversGetQueries } from '#types/queries.type.js';

export interface IDriverController {
  getDrivers: (query: DriversGetQueries) => Promise<{ totalCount: number; list: FilteredPersonalInfo<Driver>[] }>;
  getDriver: (id: string) => Promise<FilteredPersonalInfo<Driver>>;
  postLikeDriver: (id: string) => Promise<FilteredPersonalInfo<Driver>>;
  deleteLikeDriver: (id: string) => Promise<FilteredPersonalInfo<Driver>>;
}

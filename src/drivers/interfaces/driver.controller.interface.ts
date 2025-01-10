import { Driver } from '#drivers/driver.types.js';
import { FilteredPersonalInfo } from '#types/personal.type.js';
import { GetQueries } from '#types/queries.type.js';

export interface IDriverController {
  getDrivers: (query: GetQueries) => Promise<{ totalCount: number; list: Driver[] }>;
  getDriver: (id: string) => Promise<FilteredPersonalInfo<Driver>>;
}

import { Driver } from '#drivers/driver.types.js';
import { GetQueries } from '#types/queries.type.js';

export interface IDriverController {
  getDrivers: (query: GetQueries) => Promise<{ totalCount: number; list: Driver[] }>;
}

import { Driver } from '#drivers/driver.types.js';
import { FilteredPersonalInfo } from '#types/personal.type.js';

export interface IDriverService {
  findDriver: (id: string) => Promise<FilteredPersonalInfo<Driver>>;
}

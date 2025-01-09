import { Driver } from '#drivers/driver.types.js';

export interface IDriverService {
  findDriver: (id: string) => Promise<Driver>;
}

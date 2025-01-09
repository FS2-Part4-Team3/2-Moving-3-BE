import { Driver } from '#drivers/driver.types.js';

export interface IDriverController {
  getDriver: (id: string) => Promise<Driver>;
}

import { DriverNotFoundException } from '#drivers/driver.exception.js';
import { DriverRepository } from '#drivers/driver.repository.js';
import { IDriverService } from '#drivers/interfaces/driver.service.interface.js';
import { FindOptions } from '#types/options.type.js';
import filterSensitiveData from '#utils/filterSensitiveData.js';
import { Injectable } from '@nestjs/common';

@Injectable()
export class DriverService implements IDriverService {
  constructor(private readonly driverRepository: DriverRepository) {}

  async findDrivers(options: FindOptions) {
    const totalCount = await this.driverRepository.count();
    const drivers = await this.driverRepository.findMany(options);
    const list = drivers.map(driver => filterSensitiveData(driver));

    return { totalCount, list };
  }

  async findDriver(id: string) {
    const driver = await this.driverRepository.findById(id);
    if (!driver) {
      throw new DriverNotFoundException();
    }

    return filterSensitiveData(driver);
  }
}

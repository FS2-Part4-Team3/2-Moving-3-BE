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
}

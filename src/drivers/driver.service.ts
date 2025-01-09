import { DriverRepository } from '#drivers/driver.repository.js';
import { IDriverService } from '#drivers/interfaces/driver.service.interface.js';
import { FindOptions } from '#types/options.type.js';
import { Injectable } from '@nestjs/common';

@Injectable()
export class DriverService implements IDriverService {
  constructor(private readonly driverRepository: DriverRepository) {}

  async findDrivers(options: FindOptions) {
    const totalCount = await this.driverRepository.count();
    const list = await this.driverRepository.findMany(options);

    return { totalCount, list };
  }
}

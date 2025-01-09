import { DriverNotFoundException } from '#drivers/driver.exception.js';
import { DriverRepository } from '#drivers/driver.repository.js';
import { IDriverService } from '#drivers/interfaces/driver.service.interface.js';
import { Injectable } from '@nestjs/common';

@Injectable()
export class DriverService implements IDriverService {
  constructor(private readonly driverRepository: DriverRepository) {}

  async findDriver(id: string) {
    const driver = await this.driverRepository.findById(id);
    if (!driver) {
      throw new DriverNotFoundException();
    }

    return driver;
  }
}

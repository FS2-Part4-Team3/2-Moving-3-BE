import { DriverNotFoundException } from '#drivers/driver.exception.js';
import { DriverRepository } from '#drivers/driver.repository.js';
import { IDriverService } from '#drivers/interfaces/driver.service.interface.js';
import { IStorage } from '#types/common.types.js';
import filterSensitiveData from '#utils/filterSensitiveData.js';
import { Injectable } from '@nestjs/common';
import { AsyncLocalStorage } from 'async_hooks';

@Injectable()
export class DriverService implements IDriverService {
  constructor(
    private readonly driverRepository: DriverRepository,
    private readonly als: AsyncLocalStorage<IStorage>,
  ) {}

  async findDriver(id: string) {
    const driver = await this.driverRepository.findById(id);
    if (!driver) {
      throw new DriverNotFoundException();
    }

    return filterSensitiveData(driver);
  }

  async likeDriver(driverId: string) {
    const target = await this.driverRepository.findById(driverId);
    if (!target) throw new DriverNotFoundException();

    const { userId } = this.als.getStore();

    const driver = await this.driverRepository.like(driverId, userId);

    return filterSensitiveData(driver);
  }

  async unlikeDriver(driverId: string) {
    const target = await this.driverRepository.findById(driverId);
    if (!target) throw new DriverNotFoundException();

    const { userId } = this.als.getStore();

    const driver = await this.driverRepository.unlike(driverId, userId);

    return filterSensitiveData(driver);
  }
}

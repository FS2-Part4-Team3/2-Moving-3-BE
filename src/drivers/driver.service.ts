import {
  DriverInvalidTypeException,
  DriverIsLikedException,
  DriverIsUnLikedException,
  DriverNotFoundException,
} from '#drivers/driver.exception.js';
import { DriverRepository } from '#drivers/driver.repository.js';
import { DriverPatchDTO, DriverUpdateDTO } from '#drivers/driver.types.js';
import { IDriverService } from '#drivers/interfaces/driver.service.interface.js';
import { ALS, UserType } from '#types/common.types.js';
import { FindOptions } from '#types/options.type.js';
import filterSensitiveData from '#utils/filterSensitiveData.js';
import { Injectable } from '@nestjs/common';

@Injectable()
export class DriverService implements IDriverService {
  constructor(
    private readonly driverRepository: DriverRepository,
    private readonly als: ALS,
  ) {}

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

  async updateDriver(body: DriverPatchDTO) {
    const storage = this.als.getStore();
    if (storage.type !== UserType.Driver) {
      throw new DriverInvalidTypeException();
    }

    const data: DriverUpdateDTO = body;
    const { driverId } = storage;

    const driver = await this.driverRepository.update(driverId, data);

    return driver;
  }

  async likeDriver(driverId: string) {
    const target = await this.driverRepository.findById(driverId);
    if (!target) {
      throw new DriverNotFoundException();
    }

    const { userId } = this.als.getStore();

    const isLiked = await this.driverRepository.isLiked(driverId, userId);
    if (isLiked) {
      throw new DriverIsLikedException();
    }
    const driver = await this.driverRepository.like(driverId, userId);

    return filterSensitiveData(driver);
  }

  async unlikeDriver(driverId: string) {
    const target = await this.driverRepository.findById(driverId);
    if (!target) {
      throw new DriverNotFoundException();
    }

    const { userId } = this.als.getStore();

    const isLiked = await this.driverRepository.isLiked(driverId, userId);
    if (!isLiked) {
      throw new DriverIsUnLikedException();
    }

    const driver = await this.driverRepository.unlike(driverId, userId);

    return filterSensitiveData(driver);
  }
}

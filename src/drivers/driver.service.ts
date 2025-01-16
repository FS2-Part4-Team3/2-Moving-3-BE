import {
  DriverInvalidTypeException,
  DriverIsLikedException,
  DriverIsUnLikedException,
  DriverNotFoundException,
} from '#drivers/driver.exception.js';
import { DriverRepository } from '#drivers/driver.repository.js';
import { DriverPatchDTO, DriverUpdateDTO } from '#drivers/driver.types.js';
import { IDriverService } from '#drivers/interfaces/driver.service.interface.js';
import { IStorage, UserType } from '#types/common.types.js';
import { DriversFindOptions } from '#types/options.type.js';
import filterSensitiveData from '#utils/filterSensitiveData.js';
import { generateS3UploadUrl } from '#utils/S3/generate-s3-upload-url.js';
import { Injectable } from '@nestjs/common';
import { AsyncLocalStorage } from 'async_hooks';

@Injectable()
export class DriverService implements IDriverService {
  constructor(
    private readonly driverRepository: DriverRepository,
    private readonly als: AsyncLocalStorage<IStorage>,
  ) {}

  async findDrivers(options: DriversFindOptions) {
    const totalCount = await this.driverRepository.count(options);
    const drivers = await this.driverRepository.findMany(options);
    const list = await Promise.all(
      drivers.map(async driver => {
        const result = await filterSensitiveData(driver);
        const reviews = result.reviews;
        result.reviewCount = reviews.length;
        delete result.reviews;

        const career = Math.floor((Date.now() - driver.startAt) / 1000 / 86400 / 365);
        result.career = career;

        return result;
      }),
    );

    return { totalCount, list };
  }

  async findDriver(id: string) {
    const driver = await this.driverRepository.findById(id);
    if (!driver) {
      throw new DriverNotFoundException();
    }

    return await filterSensitiveData(driver);
  }

  async updateDriver(body: DriverPatchDTO) {
    const storage = this.als.getStore();
    if (storage.type !== UserType.Driver) {
      throw new DriverInvalidTypeException();
    }

    const data: DriverUpdateDTO = body;
    const { driverId } = storage;
    let url;
    if (data.image) {
      const { uploadUrl, uniqueFileName } = await generateS3UploadUrl(driverId, data.image);
      data.image = uniqueFileName;
      url = uploadUrl;
    }

    const driver = await this.driverRepository.update(driverId, data);
    driver.uploadUrl = url;

    return filterSensitiveData(driver);
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

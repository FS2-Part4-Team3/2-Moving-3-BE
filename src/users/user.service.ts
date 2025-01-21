import { DriverInvalidTokenException } from '#drivers/driver.exception.js';
import { IStorage, UserType } from '#types/common.types.js';
import { FindOptions } from '#types/options.type.js';
import { IUserService } from '#users/interfaces/user.service.interface.js';
import { UserRepository } from '#users/user.repository.js';
import { UserPatchDTO, UserUpdateDTO } from '#users/user.types.js';
import filterSensitiveData from '#utils/filterSensitiveData.js';
import { generateS3UploadUrl } from '#utils/S3/generate-s3-upload-url.js';
import { Injectable } from '@nestjs/common';
import { AsyncLocalStorage } from 'async_hooks';

@Injectable()
export class UserService implements IUserService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly als: AsyncLocalStorage<IStorage>,
  ) {}

  async getUsers(options: FindOptions) {
    const totalCount = await this.userRepository.count();
    const list = await this.userRepository.findMany(options);

    return { totalCount, list };
  }

  async updateUser(body: UserPatchDTO) {
    const storage = this.als.getStore();
    if (storage.type !== UserType.User) {
      throw new DriverInvalidTokenException();
    }
    const data: UserUpdateDTO = body;
    const { userId } = storage;
    let url;
    if (data.image) {
      const { uploadUrl, uniqueFileName } = await generateS3UploadUrl(userId, data.image);
      data.image = uniqueFileName;
      url = uploadUrl;
    }

    const user = await this.userRepository.update(userId, data);
    user.uploadUrl = url;

    return filterSensitiveData(user);
  }
}

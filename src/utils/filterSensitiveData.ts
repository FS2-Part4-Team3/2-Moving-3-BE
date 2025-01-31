import { FilteredPersonalInfo } from '#auth/types/filtered.types.js';
import { DriverModel } from '#drivers/types/driver.types.js';
import { User } from '#users/user.types.js';
import { generateS3DownloadUrl } from '#utils/S3/generate-s3-download-url.js';

export default async function filterSensitiveData<T extends User | DriverModel>(data: T): Promise<FilteredPersonalInfo<T>> {
  await generateS3DownloadUrl(data);
  const { password, salt, refreshToken, ...rest } = data;

  return rest as FilteredPersonalInfo<T>;
}

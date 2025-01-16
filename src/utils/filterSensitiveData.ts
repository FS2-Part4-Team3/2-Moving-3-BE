import { Driver } from '#drivers/driver.types.js';
import { FilteredPersonalInfo } from '#types/personal.type.js';
import { User } from '#users/user.types.js';
import { generateS3DownloadUrl } from '#utils/S3/generate-s3-download-url.js';

export default async function filterSensitiveData<T extends User | Driver>(data: T): Promise<FilteredPersonalInfo<T>> {
  await generateS3DownloadUrl(data);
  const { password, salt, refreshToken, ...rest } = data;

  return rest as FilteredPersonalInfo<T>;
}

import { DriverModel } from '#drivers/types/driver.types.js';
import { User } from '#users/user.types.js';
import { generatePresignedDownloadUrl } from '#utils/S3/generate-presigned-download-url.js';

export async function generateS3DownloadUrl(person: User | DriverModel) {
  if (!person.image) {
    return;
  }

  const uniqueFileName = person.image;
  const s3Key = `image/${person.id}/${uniqueFileName}`;

  const downloadUrl = await generatePresignedDownloadUrl(s3Key);
  person.image = downloadUrl;

  return downloadUrl;
}

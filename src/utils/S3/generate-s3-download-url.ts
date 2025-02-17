import { IChat } from '#chats/types/chat.types.js';
import { IDriver } from '#drivers/types/driver.types.js';
import { User } from '#users/types/user.types.js';
import { generatePresignedDownloadUrl } from '#utils/S3/generate-presigned-download-url.js';

export async function generateS3DownloadUrl(person: User | IDriver) {
  if (!person.image) {
    return;
  }

  const uniqueFileName = person.image;
  const s3Key = `image/${person.id}/${uniqueFileName}`;

  const downloadUrl = await generatePresignedDownloadUrl(s3Key);
  person.image = downloadUrl;

  return downloadUrl;
}

export async function generateS3DownloadUrlForChat(ownerId: string, chat: IChat) {
  if (!chat.image) {
    return;
  }

  const uniqueFileName = chat.image;
  const s3Key = `image/${ownerId}/${uniqueFileName}`;

  const downloadUrl = await generatePresignedDownloadUrl(s3Key);
  chat.image = downloadUrl;

  return downloadUrl;
}

import { generatePresignedUploadUrl } from '#utils/S3/generate-presigned-upload-url.js';

export async function generateS3UploadUrl(id: string, originalFileName: string) {
  const uniqueFileName = `${Date.now()}.${originalFileName}`;
  const s3Key = `image/${id}/${uniqueFileName}`;
  const extension = originalFileName.split('.').at(-1);
  let type;
  switch (extension) {
    case 'jpg':
      type = 'jpeg';
      break;
    case 'svg':
      type = 'svg+xml';
      break;
    case 'ico':
      type = 'vnd.microsoft.icon';
      break;
    default:
      type = extension;
  }
  const contentType = `image/${type}`;

  const uploadUrl = await generatePresignedUploadUrl(s3Key, contentType);

  return { uploadUrl, uniqueFileName };
}

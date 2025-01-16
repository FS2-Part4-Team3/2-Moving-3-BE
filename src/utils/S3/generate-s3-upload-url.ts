import { generatePresignedUploadUrl } from '#utils/S3/generate-presigned-upload-url.js';

export async function generateS3ImageArray(id: string, originalFileName: string) {
  const uniqueFileName = `${id}/${Date.now}.${originalFileName}`;
  const s3Key = `image/${uniqueFileName}`;
  const extension = originalFileName.split('.').at(-1);
  const type = extension === 'jpg' ? 'jpeg' : extension;
  const contentType = `image/${type}`;

  const uploadUrl = await generatePresignedUploadUrl(s3Key, contentType);

  return uploadUrl;
}

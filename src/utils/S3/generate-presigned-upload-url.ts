import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { awsAccessKeyId, awsRegion, awsSecretAccessKey, bucketName } from '#configs/aws.config.js';
import { InternalServerError } from '#types/http-error.types.js';
import MESSAGES from '#utils/constants/messages.js';

if (!awsRegion || !bucketName) {
  throw new InternalServerError(MESSAGES.NO_ENV_VARIABLE);
}

const s3 = new S3Client({
  region: awsRegion,
  credentials: {
    accessKeyId: awsAccessKeyId,
    secretAccessKey: awsSecretAccessKey,
  },
});

/**
 * S3 파일 업로드를 위한 임시 URL을 생성
 *
 * @param {string} s3Key - S3상의 저장될 파일 경로 (ex: folders/fileName.ext)
 * @param {string} contentType - 업로드할 파일의 MIME 타입 (ex: image/jpeg)
 * @param {number} expiresIn - URL 유효 시간(초) (기본값: 3600초 = 1시간)
 * @returns {Promise<string>} 서명된 URL
 */
export async function generatePresignedUploadUrl(
  s3Key: string,
  contentType: string = 'image/jpeg',
  expiresIn: number = 3600,
): Promise<string> {
  const command = new PutObjectCommand({
    Bucket: bucketName,
    Key: s3Key,
    ContentType: contentType,
  });

  return await getSignedUrl(s3, command, { expiresIn });
}

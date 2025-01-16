import awsConfig from '#configs/aws.config.js';
import { GetObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

const s3 = new S3Client({
  region: awsConfig.awsRegion,
  credentials: {
    accessKeyId: awsConfig.awsAccessKeyId,
    secretAccessKey: awsConfig.awsSecretAccessKey,
  },
});

/**
 * S3 파일에 대한 임시 다운로드 URL을 생성
 *
 * @param {string} s3Key - S3상의 파일 경로 (ex: folders/fileName.ext)
 * @param {number} expiresIn - URL 유효 시간(초) (기본값: 3600초 = 1시간)
 * @returns {Promise<string>} 서명된 URL
 */
export async function generatePresignedDownloadUrl(s3Key: string, expiresIn: number = 3600): Promise<string> {
  const command = new GetObjectCommand({
    Bucket: awsConfig.bucketName,
    Key: s3Key,
  });

  return await getSignedUrl(s3, command, { expiresIn });
}

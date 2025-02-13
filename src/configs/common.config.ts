import dotenv from 'dotenv';

dotenv.config();

if (!process.env.OAUTH_REDIRECT) {
  throw new Error('OAUTH_REDIRECT 환경변수가 설정되지 않았습니다.');
}

export const port = process.env.PORT || 3000;
export const nodeEnv = process.env.NODE_ENV || 'production';
export const oauthRedirect = process.env.OAUTH_REDIRECT || 'http://localhost:3000';

import dotenv from 'dotenv';

dotenv.config();

export const port = process.env.PORT || 3000;
export const nodeEnv = process.env.NODE_ENV || 'production';
export const oauthRedirect = process.env.OAUTH_REDIRECT || 'http://localhost:3000';

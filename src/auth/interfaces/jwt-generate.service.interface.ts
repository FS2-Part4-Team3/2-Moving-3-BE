import { TokenPayload } from '#auth/auth.types.js';

export interface IJwtGenerateService {
  generateAccessToken: (payload: TokenPayload) => string;
  generateRefreshToken: (payload: TokenPayload) => Promise<string>;
}

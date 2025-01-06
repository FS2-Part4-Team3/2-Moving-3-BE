export interface IJwtGenerateService {
  generateAccessToken: (payload: { userId: string }) => string;
  generateRefreshToken: (payload: { userId: string }) => Promise<string>;
}

export interface IJwtGenerateService {
  generateAccessToken: (payload: any) => string;
  generateRefreshToken: (payload: any) => string;
}

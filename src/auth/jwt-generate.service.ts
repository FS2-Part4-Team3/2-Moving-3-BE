import { IJwtGenerateService } from '#auth/interfaces/jwt-generate.service.interface.js';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class JwtGenerateService implements IJwtGenerateService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  generateAccessToken(payload: any) {
    const jwtSecret = this.configService.get('jwtSecret');
    const accessExpireTime = this.configService.get('accessExpireTime');
    return this.jwtService.sign(payload, {
      secret: jwtSecret,
      expiresIn: accessExpireTime,
    });
  }

  generateRefreshToken(payload: any) {
    const jwtSecret = this.configService.get('jwtSecret');
    const refreshExpireTime = this.configService.get('refreshExpireTime');
    return this.jwtService.sign(payload, {
      secret: jwtSecret,
      expiresIn: refreshExpireTime,
    });
  }
}

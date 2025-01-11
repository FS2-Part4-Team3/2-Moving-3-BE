import { IJwtGenerateService } from '#auth/interfaces/jwt-generate.service.interface.js';
import { UserRepository } from '#users/user.repository.js';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class JwtGenerateService implements IJwtGenerateService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  generateAccessToken(payload: { userId: string }) {
    const jwtSecret = this.configService.get('jwtSecret');
    const accessExpireTime = this.configService.get('accessExpireTime');

    const accessToken = this.jwtService.sign(payload, {
      secret: jwtSecret,
      expiresIn: accessExpireTime,
    });
    return accessToken;
  }

  async generateRefreshToken(payload: { userId: string }) {
    const jwtSecret = this.configService.get('jwtSecret');
    const refreshExpireTime = this.configService.get('refreshExpireTime');

    const refreshToken = this.jwtService.sign(payload, {
      secret: jwtSecret,
      expiresIn: refreshExpireTime,
    });
    await this.userRepository.update(payload.userId, { refreshToken });
    return refreshToken;
  }
}

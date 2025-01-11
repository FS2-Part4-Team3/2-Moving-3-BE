import { TokenPayload } from '#auth/auth.types.js';
import { IJwtGenerateService } from '#auth/interfaces/jwt-generate.service.interface.js';
import { DriverRepository } from '#drivers/driver.repository.js';
import { UserType } from '#types/common.types.js';
import { UserRepository } from '#users/user.repository.js';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class JwtGenerateService implements IJwtGenerateService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly driverRepository: DriverRepository,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  generateAccessToken(payload: TokenPayload) {
    const jwtSecret = this.configService.get('jwtSecret');
    const accessExpireTime = this.configService.get('accessExpireTime');

    const accessToken = this.jwtService.sign(payload, {
      secret: jwtSecret,
      expiresIn: accessExpireTime,
    });
    return accessToken;
  }

  async generateRefreshToken(payload: TokenPayload) {
    const jwtSecret = this.configService.get('jwtSecret');
    const refreshExpireTime = this.configService.get('refreshExpireTime');

    const refreshToken = this.jwtService.sign(payload, {
      secret: jwtSecret,
      expiresIn: refreshExpireTime,
    });
    const repo = payload.type === UserType.User ? this.userRepository : this.driverRepository;
    await repo.update(payload.id, { refreshToken });
    return refreshToken;
  }
}

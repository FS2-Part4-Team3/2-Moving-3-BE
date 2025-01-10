import {
  AuthInvalidRefreshTokenException,
  AuthUserAlreadyExistException,
  AuthWrongCredentialException,
} from '#auth/auth.exception.js';
import { SignInDTO } from '#auth/auth.types.js';
import { IAuthService } from '#auth/interfaces/auth.service.interface.js';
import { JwtGenerateService } from '#auth/jwt-generate.service.js';
import { IStorage } from '#types/common.types.js';
import { SignUpDTO } from '#types/personal.type.js';
import { UserRepository } from '#users/user.repository.js';
import compareExp from '#utils/compareExp.js';
import filterSensitiveData from '#utils/filterSensitiveData.js';
import hashingPassword from '#utils/hashingPassword.js';
import { Injectable } from '@nestjs/common';
import { AsyncLocalStorage } from 'async_hooks';

@Injectable()
export class AuthService implements IAuthService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly jwtGenerateService: JwtGenerateService,
    private readonly als: AsyncLocalStorage<IStorage>,
  ) {}

  async getMe() {
    const { user } = this.als.getStore();

    return filterSensitiveData(user);
  }

  async createUser(body: SignUpDTO) {
    const data = body;
    const userExist = await this.userRepository.findByEmail(data.email);
    if (userExist) throw new AuthUserAlreadyExistException();

    const user = await this.userRepository.create(data);
    const accessToken = await this.jwtGenerateService.generateAccessToken({ userId: user.id });
    const refreshToken = await this.jwtGenerateService.generateRefreshToken({ userId: user.id });

    return { user: filterSensitiveData(user), accessToken, refreshToken };
  }

  async signIn(body: SignInDTO) {
    const { email, password } = body;
    const user = await this.userRepository.findByEmail(email);
    const hashed = hashingPassword(password, user.salt);
    if (!user) throw new AuthWrongCredentialException();
    if (user.password !== hashed) throw new AuthWrongCredentialException();

    const accessToken = await this.jwtGenerateService.generateAccessToken({ userId: user.id });
    const refreshToken = await this.jwtGenerateService.generateRefreshToken({ userId: user.id });

    return { user: filterSensitiveData(user), accessToken, refreshToken };
  }

  async getNewToken() {
    const { user, userId, refreshToken, exp } = this.als.getStore();
    if (user.refreshToken !== refreshToken) throw new AuthInvalidRefreshTokenException();

    const accessToken = this.jwtGenerateService.generateAccessToken({ userId });

    const result = { user: filterSensitiveData(user), accessToken, refreshToken };
    // NOTE 리프레시 토큰의 남은 시간이 2시간 이내일경우
    const timeRemaining = compareExp(exp);
    if (timeRemaining < 3600 * 2) {
      // NOTE 새 리프레시 토큰을 발급하고 이를 업데이트
      const refreshToken = await this.jwtGenerateService.generateRefreshToken({ userId });
      result.refreshToken = refreshToken;
    }

    return result;
  }
}

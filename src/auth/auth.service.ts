import {
  AuthInvalidRefreshTokenException,
  AuthUserAlreadyExistException,
  AuthWrongCredentialException,
} from '#auth/auth.exception.js';
import { SignInDTO, SignUpDTO } from '#auth/auth.types.js';
import { IAuthService } from '#auth/interfaces/auth.service.interface.js';
import { JwtGenerateService } from '#auth/jwt-generate.service.js';
import { DriverRepository } from '#drivers/driver.repository.js';
import { IStorage, UserType } from '#types/common.types.js';
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
    private readonly driverRepository: DriverRepository,
    private readonly jwtGenerateService: JwtGenerateService,
    private readonly als: AsyncLocalStorage<IStorage>,
  ) {}

  async getMe() {
    const storage = this.als.getStore();

    const person = storage.type === UserType.User ? storage.user : storage.driver;

    return filterSensitiveData(person);
  }

  async createPerson(body: SignUpDTO, type: UserType) {
    const data = body;
    const repo = type === UserType.User ? this.userRepository : this.driverRepository;

    const targetExist = await repo.findByEmail(data.email);
    if (targetExist) throw new AuthUserAlreadyExistException();

    const person = await repo.create(data);
    const accessToken = await this.jwtGenerateService.generateAccessToken({ id: person.id, type });
    const refreshToken = await this.jwtGenerateService.generateRefreshToken({ id: person.id, type });

    return { person: filterSensitiveData(person), accessToken, refreshToken };
  }

  async signIn(body: SignInDTO, type: UserType) {
    const { email, password } = body;
    const user = await this.userRepository.findByEmail(email);
    const hashed = hashingPassword(password, user.salt);
    if (!user) throw new AuthWrongCredentialException();
    if (user.password !== hashed) throw new AuthWrongCredentialException();

    const accessToken = await this.jwtGenerateService.generateAccessToken({ id: user.id, type });
    const refreshToken = await this.jwtGenerateService.generateRefreshToken({ id: user.id, type });

    return { person: filterSensitiveData(user), accessToken, refreshToken };
  }

  async getNewToken() {
    const storage = this.als.getStore();
    const { type, refreshToken, exp } = storage;
    const person = type === UserType.User ? storage.user : storage.driver;
    if (person.refreshToken !== refreshToken) throw new AuthInvalidRefreshTokenException();

    const accessToken = this.jwtGenerateService.generateAccessToken({ id: person.id, type });

    const result = { person: filterSensitiveData(person), accessToken, refreshToken, type };
    // NOTE 리프레시 토큰의 남은 시간이 2시간 이내일경우
    const timeRemaining = compareExp(exp);
    if (timeRemaining < 3600 * 2) {
      // NOTE 새 리프레시 토큰을 발급하고 이를 업데이트
      const refreshToken = await this.jwtGenerateService.generateRefreshToken({ id: person.id, type });
      result.refreshToken = refreshToken;
    }

    return result;
  }
}
